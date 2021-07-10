import firebase from "firebase/app"
import "firebase/auth"

const LOGIN_DETAILS_STORAGE_KEY = "LOGIN_DETAILS_STORAGE_KEY"

export function getIdToken(): string | undefined {
    return localStorage.getItem(LOGIN_DETAILS_STORAGE_KEY) ?? undefined
}

export function setLoginDetails(data: any) {
    localStorage.setItem(LOGIN_DETAILS_STORAGE_KEY, data.credential.idToken)
}

export async function loginWithFirebase() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const res = await firebase.auth().signInWithPopup(provider)
    setLoginDetails(res)
}
