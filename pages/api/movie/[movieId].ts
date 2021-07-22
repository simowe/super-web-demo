import { ObjectId } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next"
import { benchmark } from "server/benchmark"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === "POST") {
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.status(200).send("HEI")
        return
    }

    const { movieId } = req.query
    const movie = await benchmark("fetchMovie", () =>
        fetchMovie(movieId as string)
    )
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(200).json(movie)
}

export async function fetchMovie(movieId: string) {
    const movies = await getMoviesCollection()

    return await movies.findOne({
        _id: new ObjectId(movieId),
    })
}
