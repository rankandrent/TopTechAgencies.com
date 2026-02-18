import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

console.log('🔌 MongoDB Initializing with URI:', uri.split('@')[1] || 'local');

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.error('⚠️ MONGODB_URI is missing in .env.local');
    // throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise.
export default clientPromise as Promise<MongoClient>;
