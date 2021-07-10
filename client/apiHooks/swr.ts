import { SWRConfiguration } from "swr"

export const swrProps: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
}

export async function fetchJson(url: string) {
    return fetch(url).then((result) => result.json())
}

function delay(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout)
    })
}
