import { FilterQuery } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next"
import { benchmark } from "server/benchmark"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { director } = req.query
    const result = await benchmark("fetchDirector", () =>
        fetchDirector(director as string)
    )
    res.status(200).json(result)
}

export async function fetchDirector(director: string) {
    const movies = await getMoviesCollection()

    const findParams = getFindParams(director)

    const data = await movies.find(findParams).sort({ released: -1 }).toArray()

    return { data }
}

function getFindParams(director: string) {
    const params: FilterQuery<any> = {
        poster: { $ne: null },
        "imdb.rating": { $ne: "" },
        directors: director,
    }

    return params
}
