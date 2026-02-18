
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('search_tkxel');
        const collection = db.collection('agencies');

        console.log("🔍 Searching for 'Gold Front'...");

        // Logic from getAgencyBySlug
        const slug = "gold-front";
        const namePattern = slug.replace(/-/g, '[^a-z0-9]*');

        const agencies = await collection.find({
            table_name: 'agencies',
            name: { $regex: new RegExp(`^${namePattern}$`, 'i') }
        }).limit(5).toArray();

        console.log(`Found ${agencies.length} matches.`);

        if (agencies.length > 0) {
            console.log("First match data:");
            console.log(JSON.stringify(agencies[0], null, 2));
        } else {
            // Fallback search logic
            console.log("Trying fallback search...");
            const words = slug.split('-').filter(w => w.length > 1);
            const fallbackPattern = words.map(w => `(?=.*${w})`).join('');
            const fallbackResults = await collection.find({
                table_name: 'agencies',
                name: { $regex: new RegExp(fallbackPattern, 'i') }
            }).limit(20).toArray();
            console.log(`Fallback found ${fallbackResults.length} matches.`);
            if (fallbackResults.length > 0) {
                console.log(JSON.stringify(fallbackResults[0], null, 2));
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
