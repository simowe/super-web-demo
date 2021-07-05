import { ObjectId } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { movieId } = req.query

    const movies = await getMoviesCollection()

    const result = await movies.findOne({
        _id: new ObjectId(movieId as string),
    })

    res.status(200).json(result)
}
