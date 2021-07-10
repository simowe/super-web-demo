import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { search, after } = req.query

    const result = await fetchMovies(search as string, after as string)
    res.status(200).json(result)
}

export async function fetchMovies(search?: string, after?: string) {
    const movies = await getMoviesCollection()

    const findParams = getFindParams(search, after)

    const data = await movies
        .find(findParams)
        .sort({ "imdb.rating": -1 })
        .limit(10)
        .toArray()

    const cursor = data[data.length - 1]?.imdb.rating
    return { data, cursor }
}

function getFindParams(search?: string, after?: string) {
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

    const afterParams = (() => {
        if (!after) return {}

        return { "imdb.rating": { $lt: Number(after), $ne: "" } }
    })()

    return {
        ...commonParams,
        ...searchParams,
        ...afterParams,
    }
}
