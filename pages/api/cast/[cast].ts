import { FilterQuery } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next"
import { benchmark } from "server/benchmark"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { cast } = req.query

    const result = await benchmark("fetchCast", () => fetchCast(cast as string))

    res.status(200).json(result)
}

export async function fetchCast(cast: string) {
    const movies = await getMoviesCollection()

    const findParams = getFindParams(cast)

    const data = await movies
        .find(findParams)
        .sort({ "imdb.rating": -1 })
        .toArray()

    return { data }
}

function getFindParams(cast: string) {
    const params: FilterQuery<any> = {
        poster: { $ne: null },
        "imdb.rating": { $ne: "" },
        cast,
    }

    return params
}
