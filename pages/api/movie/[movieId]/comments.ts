import { ObjectId } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next"
import { benchmark } from "server/benchmark"
import { getCommentsCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const movie_id = req.query.movieId as string
    const comments = await benchmark("fetchComments", () =>
        fetchComments(movie_id)
    )
    res.status(200).json(comments)
}

async function fetchComments(movie_id: string) {
    const comments = await getCommentsCollection()

    return await comments
        .find({
            movie_id: new ObjectId(movie_id),
        })
        .sort({ date: -1 })
        .limit(20)
        .toArray()
}
