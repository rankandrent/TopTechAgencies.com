
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environmental variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
    console.log('Checking for city_slug: austin');

    const { data, error } = await supabase
        .from('blog_agencies')
        .select('*')
        .eq('city_slug', 'austin');

    if (error) {
        console.error('Error fetching data:', error);
    } else {
        console.log(`Found ${data?.length} agencies for austin`);
        data?.forEach(agency => {
            console.log(`- [Rank ${agency.rank}] ${agency.name}`);
        });
    }
}

main();
