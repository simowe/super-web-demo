import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const movies = await getMoviesCollection()

    const { search } = req.query

    const findParams = getFindParams(search as string)

    const result = await movies
        .find(findParams)
        .sort({ "imdb.rating": -1 })
        .limit(10)
        .toArray()

    res.status(200).json(result)
}

function getFindParams(search: string | undefined) {
    const commonParams = {
        poster: { $ne: null },
        "imdb.rating": { $ne: "" },
    }

    const searchParams = (() => {
        if (!search) return {}

        const logicalAndSearch = search
            .split(" ")
            .map((word) => `"${word}"`)
            .join(" ")
            .trim()

        return { $text: { $search: logicalAndSearch } }
    })()

    return {
        ...commonParams,
        ...searchParams,
    }
}
