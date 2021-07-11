import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { genre, after } = req.query

    const result = await fetchGenre(genre as string, after as string)
    res.status(200).json(result)
}

export async function fetchGenre(genre: string, after?: string) {
    const movies = await getMoviesCollection()

    const findParams = getFindParams(genre, after)

    const data = await movies
        .find(findParams)
        .sort({ "imdb.rating": -1 })
        .limit(20)
        .toArray()

    const cursor = data[data.length - 1]?.imdb.rating
    return { data, cursor }
}

function getFindParams(genre: string, after?: string) {
    const commonParams = {
        poster: { $ne: null },
        "imdb.rating": { $ne: "" },
    }

    const genreParams = (() => {
        if (!genre) return {}

        return { genres: genre }
    })()

    const afterParams = (() => {
        if (!after) return {}

        return { "imdb.rating": { $lt: Number(after), $ne: "" } }
    })()

    return {
        ...commonParams,
        ...genreParams,
        ...afterParams,
    }
}
