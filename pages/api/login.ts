import { NextApiRequest, NextApiResponse } from "next"
import { verifyFirebaseIdToken } from "server/firebase"
import { generateJWT } from "server/jwt"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const id_token = req.headers.authorization
        if (id_token === undefined) {
            throw new Error("Missing Authorization header")
        }

        const user = await verifyFirebaseIdToken(id_token)
        const token = await generateJWT(user.uid)

        res.status(200).json({ token })
    } catch (e) {
        console.log(e)
        res.status(401).json("Fuck you")
    }
}
