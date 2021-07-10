import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { cast, after } = req.query

    const result = await fetchCast(cast as string, after as string)
    res.status(200).json(result)
}

export async function fetchCast(cast: string, after?: string) {
    const movies = await getMoviesCollection()

    const findParams = getFindParams(cast, after)

    const data = await movies
        .find(findParams)
        .sort({ "imdb.rating": -1 })
        .limit(10)
        .toArray()

    const cursor = data[data.length - 1]?.imdb.rating
    return { data, cursor }
}

function getFindParams(cast: string, after?: string) {
    const commonParams = {
        poster: { $ne: null },
        "imdb.rating": { $ne: "" },
    }

    const castParams = (() => {
        if (!cast) return {}

        return { cast: cast }
    })()

    const afterParams = (() => {
        if (!after) return {}

        return { "imdb.rating": { $lt: Number(after), $ne: "" } }
    })()

    return {
        ...commonParams,
        ...castParams,
        ...afterParams,
    }
}
