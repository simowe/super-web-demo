import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { query } = req.query
    if (!query) {
        res.status(200).json({ data: [] })
    } else {
        const result = await fetchAutocompleteResults(query as string)
        res.status(200).json(result)
    }
}

export async function fetchAutocompleteResults(query?: string) {
    const movies = await getMoviesCollection()

    const searchAggregation = {
        $search: {
            index: "movies",
            autocomplete: {
                query,
                path: "title",
                tokenOrder: "sequential",
            },
        },
    }

    const data = await movies
        .aggregate([
            searchAggregation,
            { $limit: 10 },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    year: 1,
                },
            },
        ])
        .toArray()

    return { data }
}
