import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_CONNECTION_STRING!

//@ts-ignore
console.log("Has existing connection", !!global.mongodbConnection)

//@ts-ignore
if (global.mongodbConnection === undefined) {
    //@ts-ignore
    global.mongodbConnection = new Promise<MongoClient>((resolve, reject) => {
        console.log("Connecting to mongo")
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // minPoolSize: 2,
        })

        client.connect(async (err) => {
            if (err) reject(err)
            else resolve(client)
        })
    })
}

async function getDatabase() {
    //@ts-ignore
    return (await global.mongodbConnection).db("sample_mflix")
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
