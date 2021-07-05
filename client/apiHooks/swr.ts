import useSWR, { cache, SWRConfiguration } from "swr"

export const swrProps: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
}

export function useSWRCached<T>(
    url: string | null,
    fetcher: (url: string) => Promise<T>,
    props: SWRConfiguration
) {
    const shouldCacheInitialData =
        props.initialData !== undefined && url !== null && !cache.has(url)

    if (shouldCacheInitialData) {
        cache.set(url, props.initialData)
    }

    return useSWR<T>(url, fetcher, {
        ...swrProps,
        ...props,
    })
}

export async function fetchJson(url: string) {
    await delay(2000)

    return fetch(url).then((result) => result.json())
}

function delay(timeout: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout)
    })
}
