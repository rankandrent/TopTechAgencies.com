
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('search_tkxel');
        const collection = db.collection('agencies');

        const cityRegex = /San Jose/i;
        const serviceRegex = /Blockchain/i; // "Blockchain Development"

        console.log('🔍 Searching DB for Blockchain agencies in San Jose...');

        const count = await collection.countDocuments({
            table_name: 'agencies',
            locality: { $regex: cityRegex },
            $or: [
                { services: { $regex: serviceRegex } },
                { description: { $regex: serviceRegex } }
            ]
        });

        console.log(`📊 Found ${count} matching agencies.`);

        if (count > 0) {
            const docs = await collection.find({
                table_name: 'agencies',
                locality: { $regex: cityRegex },
                $or: [
                    { services: { $regex: serviceRegex } },
                    { description: { $regex: serviceRegex } }
                ]
            }).limit(3).toArray();
            console.log('First match:', docs[0].name);
        } else {
            console.log('⚠️ No results found. This explains why only tkxel shows up.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();
