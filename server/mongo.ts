import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_CONNECTION_STRING!

const client = new Promise<MongoClient>((resolve, reject) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    client.connect(async (err) => {
        if (err) reject(err)
        else resolve(client)
    })
})

export async function getMongodbClient() {
    return client
}

export async function getMoviesCollection() {
    return (await getMongodbClient()).db("sample_mflix").collection("movies")
}
