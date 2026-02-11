import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import { parse } from 'csv-parse'
import * as path from 'path'

const SUPABASE_URL = 'https://zjcjwlojxvxrimvvspoi.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqY2p3bG9qeHZ4cmltdnZzcG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY0MDQ2NCwiZXhwIjoyMDg2MjE2NDY0fQ.QgpNFOoxPIfiyW0X2A9ChAiX4jYXEZw_qbd1ggKKcfo'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const CSV_FILE = path.join(process.cwd(), 'dbxgghxpzihzs5.csv')
const BATCH_SIZE = 500

function isValidDate(dateString: string) {
    if (!dateString || dateString === '0000-00-00 00:00:00') return false
    const date = new Date(dateString)
    return !isNaN(date.getTime())
}

function cleanString(str: string) {
    if (typeof str !== 'string') return str
    // Remove null bytes and other common Postgres-unfriendly characters
    return str.replace(/\0/g, '').trim()
}

async function uploadCSV() {
    console.log('Starting CSV upload (Strict Cleaning Mode)...')

    const parser = fs.createReadStream(CSV_FILE).pipe(
        parse({
            columns: false,
            skip_empty_lines: true,
            relax_column_count: true,
        })
    )

    let batch: any[] = []
    let totalInserted = 0
    let skippedRows = 0
    let errorCount = 0

    for await (const row of parser) {
        // Strict Action ID check: must be a row with 14 columns where row[0] is a number
        const actionId = parseInt(row[0])
        if (row.length === 14 && !isNaN(actionId) && row[0].length > 0) {
            const mappedRecord = {
                action_id: actionId,
                hook: cleanString(row[1]),
                status: cleanString(row[2]),
                scheduled_date_gmt: isValidDate(row[3]) ? row[3] : null,
                scheduled_date_local: isValidDate(row[4]) ? row[4] : null,
                priority: parseInt(row[5]) || 10,
                args: cleanString(row[6]),
                schedule: cleanString(row[7]),
                group_id: parseInt(row[8]) || 0,
                attempts: parseInt(row[9]) || 0,
                last_attempt_gmt: isValidDate(row[10]) ? row[10] : null,
                last_attempt_local: isValidDate(row[11]) ? row[11] : null,
                claim_id: parseInt(row[12]) || 0,
                extended_args: row[13] ? cleanString(row[13]) : null,
            }

            batch.push(mappedRecord)

            if (batch.length >= BATCH_SIZE) {
                const { error } = await supabase.from('actions').upsert(batch, { onConflict: 'action_id' })
                if (error) {
                    errorCount++
                    console.error(`\nError inserting batch: ${error.message} (Detail: ${error.details})`)
                } else {
                    totalInserted += batch.length
                    process.stdout.write(`\rInserted ${totalInserted} rows (Errors: ${errorCount}, Skipped: ${skippedRows})...`)
                }
                batch = []
            }
        } else {
            skippedRows++
        }
    }

    if (batch.length > 0) {
        const { error } = await supabase.from('actions').upsert(batch, { onConflict: 'action_id' })
        if (error) {
            console.error('\nError inserting final batch:', error.message)
        } else {
            totalInserted += batch.length
            console.log(`\nFinished! Total actions inserted: ${totalInserted}. Errors: ${errorCount}. Skipped: ${skippedRows}`)
        }
    }
}

uploadCSV().catch(err => console.error('Fatal error:', err))
