
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI is missing in .env');
    process.exit(1);
}

console.log('🔄 Testing MongoDB connection...');
// Hide credentials in log
console.log(`URI: ${uri.replace(/:([^@]+)@/, ':****@')}`);

const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
});

async function run() {
    try {
        await client.connect();
        console.log('✅ Connected successfully to MongoDB!');
        const db = client.db('search_tkxel');
        const count = await db.collection('agencies').countDocuments();
        console.log(`📊 'agencies' collection has ${count} documents.`);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
    } finally {
        await client.close();
    }
}

run();
