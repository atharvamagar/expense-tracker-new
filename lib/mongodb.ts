import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
}

const options = {
    retryWrites: true,
    w: 'majority'
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
            .catch(err => {
                console.error('MongoDB connection error:', err)
                throw err
            })
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
        .catch(err => {
            console.error('MongoDB connection error:', err)
            throw err
        })
}

export default clientPromise

