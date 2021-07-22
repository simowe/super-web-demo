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

            compound: {
                minimumShouldMatch: 1,
                should: [
                    {
                        phrase: {
                            query,
                            path: "title",
                        },
                    },
                    {
                        phrase: {
                            query,
                            path: "cast",
                        },
                    },
                    {
                        phrase: {
                            query,
                            path: "directors",
                        },
                    },
                ],
            },
        },
    }

    const data = await movies
        .aggregate([searchAggregation, { $limit: 50 }])
        .toArray()

    return { data }
}
