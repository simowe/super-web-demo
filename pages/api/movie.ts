import type { NextApiRequest, NextApiResponse } from "next"
import { getMoviesCollection } from "server/mongo"
import { sortBy } from "lodash"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const movies = await getMoviesCollection()

    // const { search, after } = req.query

    const findParams = getFindParams(req.query)

    const data = sortBy(
        await movies
            .find(findParams)
            .sort({ "imdb.rating": req.query.before ? 1 : -1 })
            .limit(10)
            .toArray(),
        (a) => -a.imdb.rating
    )

    const cursor = data[data.length - 1]?.imdb.rating
    console.log(cursor, findParams)
    res.status(200).json({ data, cursor })
}

function getFindParams(queryParams: {
    [key: string]: string | undefined | string[]
}) {
    const commonParams = {
        poster: { $ne: null },
        "imdb.rating": { $ne: "" },
    }

    const searchParams = (() => {
        const search = queryParams.search as string | undefined
        if (!search) return {}

        const logicalAndSearch = search
            .split(" ")
            .map((word) => `"${word}"`)
            .join(" ")
            .trim()

        return { $text: { $search: logicalAndSearch } }
    })()

    const afterParams = (() => {
        const after = queryParams.after as string | undefined
        if (!after) return {}

        return { "imdb.rating": { $lt: Number(after), $ne: "" } }
    })()

    const beforeParams = (() => {
        const before = queryParams.before as string | undefined
        if (!before) return {}

        return { "imdb.rating": { $gt: Number(before), $ne: "" } }
    })()

    return {
        ...commonParams,
        ...searchParams,
        ...afterParams,
        ...beforeParams,
    }
}
