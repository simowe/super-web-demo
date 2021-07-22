import type { NextApiRequest, NextApiResponse } from "next"
import { benchmark } from "server/benchmark"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { query } = req.query

    const result = await fetchSearchResults(query as string)
    res.status(200).json(result)
}

export async function fetchSearchResults(query?: string) {
    const movies = await getMoviesCollection()

    const searchAggregation = {
        $search: {
            index: "movies",
            phrase: {
                query,
                path: ["title", "cast", "directors"],
            },
        },
    }

    const data = await benchmark("Atlas search", async () =>
        movies.aggregate([searchAggregation, { $limit: 50 }]).toArray()
    )

    return { data }
}
