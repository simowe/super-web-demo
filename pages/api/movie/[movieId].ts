import { ObjectId } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { movieId } = req.query
    const movie = await fetchMovie(movieId as string)
    res.status(200).json(movie)
}

export async function fetchMovie(movieId: string) {
    const movies = await getMoviesCollection()

    return await movies.findOne({
        _id: new ObjectId(movieId),
    })
}
