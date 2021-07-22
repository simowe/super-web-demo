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

    const searchAggregation = {
        $search: {
            index: "movies",

            compound: {
                must: [
                    {
                        text: {
                            query: "drama",
                            path: "genres",
                        },
                    },
                    {
                        text: {
                            query: "comedy",
                            path: "genres",
                        },
                    },
                ],
            },
        },
    }

    const data = await benchmark("Genres atlas", () =>
        movies.aggregate([searchAggregation, { $limit: 10 }]).toArray()
    )

    return { data }
}
