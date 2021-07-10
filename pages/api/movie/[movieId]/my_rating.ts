import firebase from "firebase"
import "common/firebaseConfig"
import type { NextApiRequest, NextApiResponse } from "next"
import { getRatingsCollection } from "server/mongo"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const id_token = req.headers.authorization

        const { movieId } = req.query

        const user = await firebaseLogin(id_token)

        const rating = await fetchMyRating(user.uid, movieId as string)

        res.status(200).json({ rating })
    } catch (e) {
        console.log(e)
        res.status(401).json("Fuck you")
    }
}

async function firebaseLogin(id_token: string | undefined) {
    let time = Date.now()

    if (id_token === undefined) throw new Error("Missing Authorization header")

    var credential = firebase.auth.GoogleAuthProvider.credential(id_token)

    const { user } = await firebase.auth().signInWithCredential(credential)
    if (user === null) throw new Error("WTF DUDE!")

    console.log("Firebase login time", Date.now() - time, "ms")
    return user
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
