import { getApiToken } from "client/login"
import { SWRConfiguration } from "swr"

export const swrProps: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
}

export async function fetchJson(url: string) {
    return fetch(url).then((result) => result.json())
}

export async function fetchJsonAuth(url: string) {
    const idToken = getApiToken()
    if (idToken === undefined) return

    const params: RequestInit = {
        headers: { Authorization: idToken },
    }
    return fetch(url, params).then((result) => result.json())
}

export function getAuthHeaders(): RequestInit {
    const idToken = getApiToken()!

    return { headers: { Authorization: idToken } }
}
