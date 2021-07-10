import firebaseAuth from "common/firebaseAuth"

export async function verifyFirebaseIdToken(id_token: string) {
    let time = Date.now()

    var credential = firebaseAuth.GoogleAuthProvider.credential(id_token)

    const { user } = await firebaseAuth().signInWithCredential(credential)
    if (user === null) throw new Error("Unrecoverable error with login")

    console.log("Firebase login time", Date.now() - time, "ms")
    return user
}
