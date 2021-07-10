import { getIdToken } from "client/login"
import { SWRConfiguration } from "swr"

export const swrProps: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
}

export async function fetchJson(url: string) {
    return fetch(url).then((result) => result.json())
}

export async function fetchJsonAuth(url: string) {
    const idToken = getIdToken()
    if (idToken === undefined) return

    const params: RequestInit = {
        headers: { Authorization: idToken },
    }
    return fetch(url, params).then(async (result) => {
        const j = await result.json()
        console.log(result, j)
        return j
    })
}

// Not used
function delay(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout)
    })
}
