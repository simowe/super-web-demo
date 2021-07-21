import { useCallback } from "react"
import { SWRInfiniteConfiguration, useSWRInfinite } from "swr"

export function useSWRInfiniteHelper<
    T extends { data: any[]; cursor: string | null }
>(
    getUrl: (data: T | null) => string | null,
    fetcher: (url: string) => Promise<T>,
    props: SWRInfiniteConfiguration<T>
) {
    const swr = useSWRInfinite<T>((_, data) => getUrl(data), fetcher, props)

    const fetchMore = useCallback(() => {
        swr.setSize(swr.size + 1)
    }, [swr])

    const data = swr.data ?? []
    const isEnded = data[data.length - 1]?.cursor === null
    const isLoading = !isEnded && data[swr.size - 1] === undefined
    const isEmpty = isEnded && data[0].data.length === 0

    return {
        ...swr,
        fetchMore,
        isLoading,
        isEnded,
        isEmpty,
    }
}

export function inArrayIfExists<T>(value: T | null | undefined) {
    if (value === null || value === undefined) return undefined

    return [value]
}
