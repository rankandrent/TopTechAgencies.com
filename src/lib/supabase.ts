import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zjcjwlojxvxrimvvspoi.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqY2p3bG9qeHZ4cmltdnZzcG9pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDY0MDQ2NCwiZXhwIjoyMDg2MjE2NDY0fQ.QgpNFOoxPIfiyW0X2A9ChAiX4jYXEZw_qbd1ggKKcfo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
