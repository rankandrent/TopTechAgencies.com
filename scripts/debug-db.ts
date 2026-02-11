
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environmental variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

async function main() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db('search_tkxel');
        const collection = db.collection('agencies');

        console.log('--- Checking iPhone/Mobile Agencies ---');

        // Exact "iPhone" match
        const iphoneCount = await collection.countDocuments({
            services: { $regex: 'iPhone', $options: 'i' }
        });
        console.log(`Agencies with "iPhone" in services: ${iphoneCount}`);

        // Exact "iOS" match
        const iosCount = await collection.countDocuments({
            services: { $regex: 'iOS', $options: 'i' }
        });
        console.log(`Agencies with "iOS" in services: ${iosCount}`);

        // Exact "Mobile" match
        const mobileCount = await collection.countDocuments({
            services: { $regex: 'Mobile', $options: 'i' }
        });
        console.log(`Agencies with "Mobile" in services: ${mobileCount}`);

        // Sample service strings
        console.log('\n--- Sample Services Strings ---');
        const samples = await collection.find({}).limit(5).toArray();
        samples.forEach(s => {
            console.log(`- ${s.name}: ${s.services.substring(0, 100)}...`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

main();
