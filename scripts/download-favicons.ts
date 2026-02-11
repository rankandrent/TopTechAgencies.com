import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const MONGODB_URI = process.env.MONGODB_URI || '';

// Google Favicon API
const getFaviconUrl = (websiteUrl: string): string => {
    try {
        const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
        return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
    } catch {
        return '';
    }
};

// Extract domain from URL for naming
const getDomainName = (websiteUrl: string): string => {
    try {
        const url = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
        return url.hostname.replace(/\./g, '_');
    } catch {
        return 'unknown';
    }
};

async function uploadFaviconToCloudinary(faviconUrl: string, publicId: string): Promise<string | null> {
    try {
        const result = await cloudinary.uploader.upload(faviconUrl, {
            public_id: `favicons/${publicId}`,
            folder: 'agency-favicons',
            overwrite: true,
            resource_type: 'image',
            format: 'png'
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload favicon for ${publicId}:`, error);
        return null;
    }
}

async function main() {
    console.log('🚀 Starting Favicon Download Script...\n');

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');

        const db = client.db('search_tkxel');
        const collection = db.collection('agencies');

        // Get all agencies that have a URL but no favicon_url
        const agencies = await collection.find({
            url: { $exists: true, $ne: '' },
            $or: [
                { favicon_url: { $exists: false } },
                { favicon_url: '' },
                { favicon_url: null }
            ]
        }).toArray();

        console.log(`📊 Found ${agencies.length} agencies without favicons\n`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < agencies.length; i++) {
            const agency = agencies[i];
            const websiteUrl = agency.url?.trim();

            if (!websiteUrl) {
                console.log(`⏭️  [${i + 1}/${agencies.length}] Skipping ${agency.name} - No URL`);
                continue;
            }

            console.log(`🔄 [${i + 1}/${agencies.length}] Processing: ${agency.name}`);

            const faviconUrl = getFaviconUrl(websiteUrl);
            if (!faviconUrl) {
                console.log(`   ❌ Invalid URL: ${websiteUrl}`);
                failCount++;
                continue;
            }

            const domainName = getDomainName(websiteUrl);
            const cloudinaryUrl = await uploadFaviconToCloudinary(faviconUrl, domainName);

            if (cloudinaryUrl) {
                // Update MongoDB with the Cloudinary URL
                await collection.updateOne(
                    { _id: agency._id },
                    { $set: { favicon_url: cloudinaryUrl } }
                );
                console.log(`   ✅ Uploaded: ${cloudinaryUrl}`);
                successCount++;
            } else {
                console.log(`   ❌ Failed to upload`);
                failCount++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Successfully uploaded: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log(`📁 Total processed: ${agencies.length}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

main();
