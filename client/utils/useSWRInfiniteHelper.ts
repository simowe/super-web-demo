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

    return {
        ...swr,
        fetchMore,
    }
}
