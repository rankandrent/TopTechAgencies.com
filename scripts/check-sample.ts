
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function checkSample() {
    const uri = process.env.MONGODB_URI;
    if (!uri) return console.log('No URI');
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('search_tkxel');
        const doc = await db.collection('agencies').findOne({});
        console.log('SAMPLE_DOC:', JSON.stringify(doc, null, 2));
    } catch (e) { console.error(e); }
    finally { await client.close(); }
}
checkSample();
