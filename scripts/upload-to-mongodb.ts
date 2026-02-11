import 'dotenv/config';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import * as path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'search_tkxel';
const COLLECTION_NAME = 'agencies';

const CSV_FILE = path.join(process.cwd(), 'dbxgghxpzihzs5.csv');
const BATCH_SIZE = 1000;
// Check for START_LINE env var to resume
const START_LINE = parseInt(process.env.START_LINE || '0');

function cleanString(str: any) {
    if (typeof str !== 'string') return str;
    let cleaned = str.replace(/\0/g, '').trim();

    // Fix stick-together words: lowercase followed by Uppercase
    cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2');

    // Fix stick-together words: Uppercase followed by Uppercase+lowercase (e.g. DEVELOPMENTLocated)
    cleaned = cleaned.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

    // Ensure space after punctuation if followed by a letter
    cleaned = cleaned.replace(/([.!?])([A-Za-z])/g, '$1 $2');

    // Fix multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ');

    return cleaned;
}

const HEADER_MAP: Record<string, string> = {
    'action_id,hook,status': 'actions',
    'claim_id,date_created_gmt': 'claims',
    'group_id,slug': 'groups',
    'log_id,action_id,message,log_date_gmt,log_date_local': 'logs'
};

const AGENCY_HEADERS = [
    'id', 'service_id', 'name', 'url', 'clutch_url', 'ss_path',
    'avg_rating', 'reviews', 'min_project_size', 'hourly_rate',
    'employees_count', 'locality', 'services', 'year_founded', 'description', 'generated_desc'
];

async function uploadToMongo() {
    console.log(`Connecting to MongoDB (Resume from: ${START_LINE})...`);
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        if (START_LINE === 0) {
            console.log('Clearing existing data (Fresh Start)...');
            await collection.deleteMany({});
        }

        console.log('Starting CSV stream...');
        const parser = fs.createReadStream(CSV_FILE).pipe(
            parse({
                columns: false,
                skip_empty_lines: true,
                relax_column_count: true,
                relax_quotes: true,
                escape: '"',
                bom: true
            })
        );

        let batch: any[] = [];
        let totalInserted = 0;
        let linesProcessed = 0;
        let currentTable = 'unknown';
        let currentHeaders: string[] = [];

        for await (const row of parser) {
            linesProcessed++;

            if (linesProcessed < START_LINE) {
                if (linesProcessed % 10000 === 0) process.stdout.write(`\rSkipped ${linesProcessed} lines...`);
                continue;
            }

            const cleanedRow = row.map((cell: any) => cleanString(cell));
            const rowJoined = cleanedRow.join(',');

            let foundHeader = false;
            for (const [headerStr, tableName] of Object.entries(HEADER_MAP)) {
                if (rowJoined.includes(headerStr)) {
                    currentTable = tableName;
                    currentHeaders = cleanedRow;
                    foundHeader = true;
                    break;
                }
            }

            if (!foundHeader && cleanedRow.length >= 15 && cleanedRow.length <= 17) {
                currentTable = 'agencies';
                currentHeaders = AGENCY_HEADERS;
            }

            if (foundHeader) continue;

            const rowData: Record<string, any> = {
                table_name: currentTable,
                imported_at: new Date()
            };

            if (currentHeaders.length > 0) {
                currentHeaders.forEach((header, index) => {
                    rowData[header] = cleanedRow[index] || null;
                });
            } else {
                rowData['raw_data'] = cleanedRow;
            }

            batch.push(rowData);

            if (batch.length >= BATCH_SIZE) {
                await collection.insertMany(batch);
                totalInserted += batch.length;
                process.stdout.write(`\rProcessed ${linesProcessed} lines (Inserted: ${totalInserted})...`);
                batch = [];
            }
        }

        if (batch.length > 0) {
            await collection.insertMany(batch);
            totalInserted += batch.length;
        }

        console.log(`\nFinished! Rows processed in this session: ${totalInserted}`);

        if (START_LINE === 0) {
            console.log('Creating indexes...');
            await collection.createIndex({ table_name: 1 });
            await collection.createIndex({ locality: 'text', services: 'text', name: 'text' });
        }

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.close();
    }
}

uploadToMongo().catch(err => console.error('Fatal error:', err));
