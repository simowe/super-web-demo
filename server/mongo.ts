import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_CONNECTION_STRING!

const client = new Promise<MongoClient>((resolve, reject) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        minPoolSize: 2,
    })

    client.connect(async (err) => {
        if (err) reject(err)
        else resolve(client)
    })
})

async function getDatabase() {
    return (await client).db("sample_mflix")
}

export async function getMoviesCollection() {
    return (await getDatabase()).collection("movies")
}

export async function getRatingsCollection() {
    return (await getDatabase()).collection("ratings")
}

export async function getCommentsCollection() {
    return (await getDatabase()).collection("comments")
}
