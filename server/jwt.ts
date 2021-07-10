import jwt, { JwtPayload } from "jsonwebtoken"
import { NextApiRequest } from "next"

const secret = process.env.JWT_SECRET!

export async function generateJWT(user_id: string) {
    return new Promise<string>((resolve, reject) => {
        const payload = {
            user_id,
        }
        jwt.sign(payload, secret, (error, token) => {
            if (error) reject(error)
            resolve(token!)
        })
    })
}

export async function verifyJWT(token: string) {
    return new Promise<JwtPayload>((resolve, reject) => {
        jwt.verify(token, secret, (error, token) => {
            if (error) reject(error)
            resolve(token!)
        })
    })
}

export async function verifyAuthorizationHeader(req: NextApiRequest) {
    const token = req.headers.authorization
    if (token === undefined) {
        throw new Error("Missing Authorization header")
    }

    return verifyJWT(token)
}
