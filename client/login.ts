import firebaseAuth from "common/firebaseAuth"

const API_TOKEN_STORAGE_KEY = "LOGGED_IN_API_KEY"

export function getApiToken(): string | undefined {
    return localStorage.getItem(API_TOKEN_STORAGE_KEY) ?? undefined
}

function setApiToken(apiToken: string) {
    localStorage.setItem(API_TOKEN_STORAGE_KEY, apiToken)
}

export function isUserLoggedIn() {
    return !!getApiToken()
}

export async function loginUser() {
    const firebaseIdToken = await loginWithFirebase()
    const apiToken = await loginWithApi(firebaseIdToken)
    setApiToken(apiToken)
}

async function loginWithFirebase() {
    const provider = new firebaseAuth.GoogleAuthProvider()
    const data = await firebaseAuth().signInWithPopup(provider)
    return (data.credential as any).idToken as string
}

async function loginWithApi(firebaseIdToken: string) {
    const params: RequestInit = {
        headers: { Authorization: firebaseIdToken },
    }
    const res = await fetch("/api/login", params)
    if (!res.ok) throw new Error("FUCK YOU DUDE")

    return (await res.json()).token as string
}
