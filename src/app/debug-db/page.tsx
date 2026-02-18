
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export default async function Page() {
    let uri = process.env.MONGODB_URI
    let status = 'Checking...'
    let errorMsg = null
    let count = 0

    if (!uri) {
        status = 'Missing URI'
        errorMsg = 'MONGODB_URI is not defined in environment variables'
    } else {
        try {
            const client = await clientPromise
            const db = client.db('search_tkxel')
            const collection = db.collection('agencies')
            count = await collection.countDocuments()
            status = 'Connected Successfully! ✅'
        } catch (err: any) {
            status = 'Connection Failed ❌'
            errorMsg = err.message
        }
    }

    return (
        <div className="p-8 font-mono max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Database Connection Debugger</h1>

            <div className="space-y-4">
                <div>NODE_ENV: {process.env.NODE_ENV}</div>

                <div className={`p-4 rounded border ${errorMsg ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
                    <div className="font-bold mb-2">Status: {status}</div>

                    {count > 0 && (
                        <div>Found {count} documents.</div>
                    )}

                    {errorMsg && (
                        <div className="mt-2 whitespace-pre-wrap">Error: {errorMsg}</div>
                    )}
                </div>

                {uri && (
                    <div className="text-xs text-gray-400 mt-4">
                        URI Masked: {uri.replace(/:([^@]+)@/, ':****@')}
                    </div>
                )}
            </div>
        </div>
    )
}
