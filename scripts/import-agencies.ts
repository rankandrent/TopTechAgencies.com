
import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'search_tkxel'; // Based on connection string
const COLLECTION_NAME = 'agencies';
const FILE_PATH = path.join(process.cwd(), 'search_tkxel.agencies.json');

async function importData() {
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is missing in .env');
        process.exit(1);
    }

    console.log(`🔌 Connecting to MongoDB: ${MONGODB_URI.replace(/:([^:@]+)@/, ':****@')}`);

    let client;
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Connected successfully to server');

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Read file
        if (!fs.existsSync(FILE_PATH)) {
            console.error(`❌ File not found: ${FILE_PATH}`);
            process.exit(1);
        }

        console.log(`📖 Reading file: ${FILE_PATH}`);
        const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');
        const data = JSON.parse(fileContent);

        if (!Array.isArray(data)) {
            console.error('❌ JSON data is not an array');
            process.exit(1);
        }

        console.log(`found ${data.length} records in file`);

        // Filter valid agency records if needed (based on previous grep, some might be other tables?)
        // The user said "ya file upload kar do", implying the whole file. 
        // But the previous grep showed "table_name": "actions" at the top.
        // We should probably filter for "table_name": "agencies" if this is a mixed dump.
        // Let's count how many are explicitly agencies.

        const agencies = data.filter(item => item.table_name === 'agencies');
        console.log(`🔍 Found ${agencies.length} records with table_name="agencies"`);

        const recordsToInsert = agencies.length > 0 ? agencies : data;

        if (recordsToInsert.length === 0) {
            console.log('⚠️ No records to insert.');
            return;
        }

        console.log(`🚀 Inserting ${recordsToInsert.length} records...`);

        const batchSize = 500;
        let totalInserted = 0;

        for (let i = 0; i < recordsToInsert.length; i += batchSize) {
            const batch = recordsToInsert.slice(i, i + batchSize);
            console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(recordsToInsert.length / batchSize)}...`);

            const bulkOps = batch.map(doc => {
                const { _id, ...docWithoutId } = doc;
                return {
                    insertOne: {
                        document: docWithoutId
                    }
                };
            });

            if (bulkOps.length > 0) {
                const result = await collection.bulkWrite(bulkOps);
                totalInserted += result.insertedCount;
                console.log(`✅ Inserted ${result.insertedCount} documents (Total: ${totalInserted})`);
            }
        }

    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Disconnected');
        }
    }
}

importData();
