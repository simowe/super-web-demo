import type { NextApiRequest, NextApiResponse } from "next"
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
            text: {
                query,
                path: {
                    wildcard: "*",
                },
            },
        },
    }

    const data = await movies.aggregate([searchAggregation]).limit(20).toArray()

    return { data }
}
