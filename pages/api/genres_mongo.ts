import type { NextApiRequest, NextApiResponse } from "next"
import { benchmark } from "server/benchmark"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { query } = req.query

    const result = await fetchGenres(query as string)
    res.status(200).json(result)
}

export async function fetchGenres(query?: string) {
    const movies = await getMoviesCollection()

    const findParams = {
        genres: { $all: ["Drama", "Comedy"] },
    }

    const data = await benchmark("Genres mongo", () =>
        movies.find(findParams).limit(10).toArray()
    )

    return { data }
}
