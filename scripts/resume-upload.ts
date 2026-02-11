import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import { parse } from 'csv-parse'
import * as path from 'path'

const SUPABASE_URL = 'https://zjcjwlojxvxrimvvspoi.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqY2p3bG9qeHZ4cmltdnZzcG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY0MDQ2NCwiZXhwIjoyMDg2MjE2NDY0fQ.QgpNFOoxPIfiyW0X2A9ChAiX4jYXEZw_qbd1ggKKcfo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CSV_FILE = path.join(process.cwd(), 'dbxgghxpzihzs5.csv')
const BATCH_SIZE = 20
const START_LINE = parseInt(process.env.START_LINE || '0')
const DELAY_MS = 3000 // 3 seconds delay between batches

function cleanString(str: any) {
    if (typeof str !== 'string') return str
    return str.replace(/\0/g, '').trim()
}

const HEADER_MAP: Record<string, string> = {
    'action_id,hook,status': 'actions',
    'claim_id,date_created_gmt': 'claims',
    'group_id,slug': 'groups',
    'log_id,action_id,message,log_date_gmt,log_date_local': 'logs'
}

const AGENCY_HEADERS = [
    'agency_id', 'dir_page_id', 'name', 'url', 'slug', 'image_path',
    'avg_rating', 'reviews_count', 'min_project_size', 'hourly_rate',
    'employees', 'locality', 'services', 'founded', 'summary', 'description'
];

async function resumeUpload() {
    console.log(`Resuming upload from line ${START_LINE} (Ultra-Polite Mode: Batch=20, Delay=3s)...`)

    // Check if we can reach Supabase
    const { error: pingError } = await supabase.from('as_raw_import').select('id').limit(1)
    if (pingError) {
        console.error('Initial connection failed, waiting 10s before start...')
        await new Promise(r => setTimeout(r, 10000))
    }

    const parser = fs.createReadStream(CSV_FILE).pipe(
        parse({
            columns: false,
            skip_empty_lines: true,
            relax_column_count: true,
            relax_quotes: true,
            escape: '"',
            bom: true
        })
    )

    let batch: any[] = []
    let totalInserted = 0
    let linesProcessed = 0
    let currentTable = 'unknown'
    let currentHeaders: string[] = []

    for await (const row of parser) {
        linesProcessed++

        const cleanedRow = row.map((cell: any) => cleanString(cell))
        const rowJoined = cleanedRow.join(',')

        let foundHeader = false
        for (const [headerStr, tableName] of Object.entries(HEADER_MAP)) {
            if (rowJoined.includes(headerStr)) {
                currentTable = tableName
                currentHeaders = cleanedRow
                foundHeader = true
                break
            }
        }

        if (!foundHeader && cleanedRow.length >= 15 && cleanedRow.length <= 17) {
            currentTable = 'agencies'
            currentHeaders = AGENCY_HEADERS
        }

        if (linesProcessed < START_LINE) {
            if (linesProcessed % 10000 === 0) {
                process.stdout.write(`\rSkipped ${linesProcessed} lines...`)
            }
            continue
        }

        if (foundHeader) continue

        const rowData: Record<string, any> = {}
        if (currentHeaders.length > 0) {
            currentHeaders.forEach((header, index) => {
                rowData[header] = cleanedRow[index] || null
            })
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
                console.error(`\nLine ${linesProcessed} - Error: ${error.message}`)
                await new Promise(r => setTimeout(r, 10000)) // 10s wait on error
            } else {
                totalInserted += batch.length
                process.stdout.write(`\rProcessed ${linesProcessed} lines (Total CSV: 179k)...`)
                await new Promise(r => setTimeout(r, DELAY_MS)) // Ultra-polite delay
            }
            batch = []
        }
    }

    if (batch.length > 0) {
        const { error } = await supabase.from('as_raw_import').insert(batch)
        if (!error) totalInserted += batch.length
    }

    console.log(`\nSession Finished! New rows: ${totalInserted}. Final line: ${linesProcessed}`)
}

resumeUpload().catch(err => console.error('Fatal error:', err))
