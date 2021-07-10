import type { NextApiRequest, NextApiResponse } from "next"
import { verifyAuthorizationHeader } from "server/jwt"
import { getRatingsCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const { movieId } = req.query

        const user = await verifyAuthorizationHeader(req)
        const rating = await fetchMyRating(user.user_id, movieId as string)

        res.status(200).json({ rating })
    } catch (e) {
        console.log(e)
        res.status(401).json("Fuck you")
    }
}

async function fetchMyRating(user_id: string, movie_id: string) {
    const ratings = await getRatingsCollection()

    return (
        await ratings.findOne({
            user_id,
            movie_id,
        })
    )?.rating
}
