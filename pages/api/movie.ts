import type { NextApiRequest, NextApiResponse } from "next"
import { getMongodbClient } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const movies = (await getMongodbClient())
        .db("sample_mflix")
        .collection("movies")

    const result = await movies.find({}).limit(10).toArray()

    res.status(200).json(result)
}
