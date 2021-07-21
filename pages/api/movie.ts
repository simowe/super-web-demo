import { FilterQuery } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { after } = req.query
    const result = await fetchMovies(after as string)
    res.status(200).json(result)
}

export async function fetchMovies(after?: string) {
    const movies = await getMoviesCollection()

    const findParams = getFindParams(after)

    const data = await movies
        .find(findParams)
        .sort({ "imdb.rating": -1 })
        .limit(20)
        .toArray()

    const cursor = data[data.length - 1]?.imdb.rating ?? null
    return { data, cursor }
}

function getFindParams(after?: string) {
    const params: FilterQuery<any> = {
        poster: { $ne: null },
        "imdb.rating": { $ne: "" },
        "imdb.votes": { $gte: 25000 },
    }

    if (after) {
        params["imdb.rating"] = { $lt: Number(after), $ne: "" }
    }

    return params
}
