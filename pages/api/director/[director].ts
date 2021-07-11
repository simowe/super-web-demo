import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { director, after } = req.query

    const result = await fetchDirector(director as string, after as string)
    res.status(200).json(result)
}

export async function fetchDirector(director: string, after?: string) {
    const movies = await getMoviesCollection()

    const findParams = getFindParams(director, after)

    const data = await movies
        .find(findParams)
        .sort({ "imdb.rating": -1 })
        .limit(20)
        .toArray()

    const cursor = data[data.length - 1]?.imdb.rating
    return { data, cursor }
}

function getFindParams(director: string, after?: string) {
    const commonParams = {
        poster: { $ne: null },
        "imdb.rating": { $ne: "" },
    }

    const directorParams = (() => {
        if (!director) return {}

        return { directors: director }
    })()

    const afterParams = (() => {
        if (!after) return {}

        return { "imdb.rating": { $lt: Number(after), $ne: "" } }
    })()

    return {
        ...commonParams,
        ...directorParams,
        ...afterParams,
    }
}
