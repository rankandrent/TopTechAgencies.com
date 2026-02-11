
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.log('No URI');
        return;
    }

    // Option Set 1: Standard
    console.log('\n--- Attempt 1: Standard Connection ---');
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('✅ Attempt 1 Success!');
        await client.close();
        return;
    } catch (e: any) {
        console.log('❌ Attempt 1 Failed:', e.message);
    }

    // Option Set 2: Allow Invalid Certs
    console.log('\n--- Attempt 2: tlsAllowInvalidCertificates: true ---');
    try {
        const client = new MongoClient(uri, {
            tls: true,
            tlsAllowInvalidCertificates: true
        });
        await client.connect();
        console.log('✅ Attempt 2 Success!');
        await client.close();
        return;
    } catch (e: any) {
        console.log('❌ Attempt 2 Failed:', e.message);
    }

    // Option Set 3: Direct to Shard (Bypass SRV)
    console.log('\n--- Attempt 3: Direct to Shard 00 ---');
    const shardUri = uri.replace('mongodb+srv://', 'mongodb://').replace('tkxel-search.3qstfq0.mongodb.net', 'ac-qd1nexk-shard-00-00.3qstfq0.mongodb.net:27017');
    console.log('URI:', shardUri.replace(/:([^:@]+)@/, ':****@'));
    try {
        const client = new MongoClient(shardUri, {
            directConnection: true,
            tls: true
        });
        await client.connect();
        console.log('✅ Attempt 3 Success!');
        await client.close();
        return;
    } catch (e: any) {
        console.log('❌ Attempt 3 Failed:', e.message);
    }

    console.log('\n🔍 DIAGNOSIS:');
    console.log('All attempts failed. Please whitelist 0.0.0.0/0 in MongoDB Atlas.');
}
test();
