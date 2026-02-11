import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import { parse } from 'csv-parse'
import * as path from 'path'

const SUPABASE_URL = 'https://zjcjwlojxvxrimvvspoi.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqY2p3bG9qeHZ4cmltdnZzcG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY0MDQ2NCwiZXhwIjoyMDg2MjE2NDY0fQ.QgpNFOoxPIfiyW0X2A9ChAiX4jYXEZw_qbd1ggKKcfo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CSV_FILE = path.join(process.cwd(), 'dbxgghxpzihzs5.csv')
const BATCH_SIZE = 500 // Increased batch size for speed

function cleanString(str: any) {
    if (typeof str !== 'string') return str
    return str.replace(/\0/g, '').trim()
}

// Map of known headers to table names
const HEADER_MAP: Record<string, string> = {
    'action_id,hook,status': 'actions',
    'claim_id,date_created_gmt': 'claims',
    'group_id,slug': 'groups',
    'log_id,action_id,message,log_date_gmt,log_date_local': 'logs'
}

// Manual mapping for the agency data segment which has no headers but 16 columns
const AGENCY_HEADERS = [
    'agency_id', 'dir_page_id', 'name', 'url', 'slug', 'image_path',
    'avg_rating', 'reviews_count', 'min_project_size', 'hourly_rate',
    'employees', 'locality', 'services', 'founded', 'summary', 'description'
];

async function uploadFullCSV() {
    console.log('Truncating as_raw_import table...')
    const { error: truncateError } = await supabase.from('as_raw_import').delete().neq('id', 0)
    if (truncateError) {
        console.error('Failed to truncate:', truncateError.message)
        return
    }

    console.log('Starting ROBUST FULL CSV upload to as_raw_import...')

    // Using a more robust stream parser config
    const parser = fs.createReadStream(CSV_FILE).pipe(
        parse({
            columns: false,
            skip_empty_lines: true,
            relax_column_count: true,
            relax_quotes: true,
            quote: '"',
            escape: '"',
            bom: true
        })
    )

    let batch: any[] = []
    let totalInserted = 0
    let currentTable = 'unknown'
    let currentHeaders: string[] = []

    parser.on('error', (err) => {
        console.error('\nParser Error:', err.message)
    })

    for await (const row of parser) {
        const cleanedRow = row.map((cell: any) => cleanString(cell))
        const rowJoined = cleanedRow.join(',')

        // 1. Check if this row is a known header
        let foundHeader = false
        for (const [headerStr, tableName] of Object.entries(HEADER_MAP)) {
            if (rowJoined.includes(headerStr)) {
                currentTable = tableName
                currentHeaders = cleanedRow
                foundHeader = true
                console.log(`\nSwitched to segment: ${currentTable}`)
                break
            }
        }

        if (foundHeader) continue

        // 2. Detect 16-column agency segment even without header
        if (cleanedRow.length >= 15 && cleanedRow.length <= 17 && currentTable !== 'agencies') {
            // If we see 16-ish columns and we haven't switched to agencies yet,
            // it's likely the agency segment.
            currentTable = 'agencies'
            currentHeaders = AGENCY_HEADERS
            console.log(`\nAuto-detected segment: ${currentTable} (${cleanedRow.length} columns)`)
        }

        // 3. Map row to object based on currentHeaders
        const rowData: Record<string, any> = {}
        if (currentHeaders.length > 0) {
            currentHeaders.forEach((header, index) => {
                rowData[header] = cleanedRow[index] || null
            })
            // If row is longer than headers, store extras
            if (cleanedRow.length > currentHeaders.length) {
                rowData['extra_columns'] = cleanedRow.slice(currentHeaders.length)
            }
        } else {
            rowData['raw_data'] = cleanedRow
        }

        batch.push({
            table_name: currentTable,
            row_data: rowData
        })

        if (batch.length >= BATCH_SIZE) {
            const { error } = await supabase.from('as_raw_import').insert(batch)
            if (error) {
                console.error(`\nError inserting batch: ${error.message}`)
            } else {
                totalInserted += batch.length
                process.stdout.write(`\rTotal rows uploaded: ${totalInserted}...`)
            }
            batch = []
        }
    }

    if (batch.length > 0) {
        const { error } = await supabase.from('as_raw_import').insert(batch)
        if (error) {
            console.error('\nError in final batch:', error.message)
        } else {
            totalInserted += batch.length
            console.log(`\nFinished! Total rows in as_raw_import: ${totalInserted}`)
        }
    }
}

uploadFullCSV().catch(err => console.error('Fatal error:', err))
