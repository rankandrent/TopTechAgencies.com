
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return console.log('No URI');

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('search_tkxel');
        const collection = db.collection('agencies');

        console.log('🔄 Adding table_name="agencies" to all records...');

        const result = await collection.updateMany(
            { table_name: { $exists: false } }, // Target records missing this field
            { $set: { table_name: 'agencies' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} documents.`);
        console.log(`ℹ️  Matched ${result.matchedCount} documents.`);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

migrate();
