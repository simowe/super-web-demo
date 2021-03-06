import { ObjectId } from "mongodb"
import type { NextApiRequest, NextApiResponse } from "next"
import { benchmark } from "server/benchmark"
import { verifyAuthorizationHeader } from "server/jwt"
import { getRatingsCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const user = await verifyAuthorizationHeader(req)

        const movie_id = req.query.movieId as string
        const user_id = user.user_id

        const get = async () => {
            const rating = await benchmark("fetchMyRating", () =>
                fetchMyRating(user_id, movie_id)
            )
            res.status(200).json({ rating })
        }

        const put = async () => {
            const rating = JSON.parse(req.body).rating
            await changeMyRating(user_id, movie_id, rating)
            res.status(200).json({ rating })
        }

        if (req.method === "GET") {
            await get()
        } else if (req.method === "PUT") {
            await put()
        } else {
            res.status(405).end()
        }
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
            movie_id: new ObjectId(movie_id),
        })
    )?.rating
}

async function changeMyRating(
    user_id: string,
    movie_id: string,
    rating: number
) {
    enforce(typeof rating === "number", "Rating is not a number!")

    const ratings = await getRatingsCollection()

    await ratings.updateOne(
        {
            user_id,
            movie_id: new ObjectId(movie_id),
        },
        { $set: { rating } },
        { upsert: true }
    )
}

function enforce(isTrue: boolean, errorMessage: string) {
    if (!isTrue) throw new Error(errorMessage)
}
