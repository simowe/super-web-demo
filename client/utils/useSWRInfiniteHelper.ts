import { useCallback } from "react"
import { SWRInfiniteConfiguration, useSWRInfinite } from "swr"

export function useSWRInfiniteHelper<T>(
    getUrl: (data: T | null) => string | null,
    fetcher: (url: string) => Promise<T>,
    props: SWRInfiniteConfiguration<T>
) {
    const swr = useSWRInfinite<T>((_, data) => getUrl(data), fetcher, props)

    const fetchMore = useCallback(() => {
        swr.setSize(swr.size + 1)
    }, [swr])

    const isLoading = (swr.data ?? [])[swr.size - 1] === undefined

    return {
        ...swr,
        fetchMore,
        isLoading,
    }
}

export function inArrayIfExists<T>(value: T | null | undefined) {
    if (value === null || value === undefined) return undefined

    return [value]
}
