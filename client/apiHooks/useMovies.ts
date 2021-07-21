import { queryParams } from "client/utils/queryParams"
import { useSWRInfiniteHelper } from "client/utils/useSWRInfiniteHelper"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type MoviesApiResult = {
    data: MovieType[]
    cursor: string | null
}

export function useMoviesInfinite(initialData?: MoviesApiResult) {
    const getUrl = (data: MoviesApiResult | null) => {
        if (data?.cursor === null) return null
        return `/api/movie${queryParams({ after: data?.cursor })}`
    }

    return useSWRInfiniteHelper<MoviesApiResult>(getUrl, fetchJson, {
        ...swrProps,
        initialData: initialData ? [initialData] : undefined,
    })
}
