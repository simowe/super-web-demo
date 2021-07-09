import { queryParams } from "client/utils/queryParams"
import { useSWRInfiniteHelper } from "client/utils/useSWRInfiniteHelper"
import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type MoviesApiResult = {
    data: MovieType[]
    cursor?: string
}

export function useMovies(search?: string, after?: string, before?: string) {
    const apiUrl = `/api/movie${queryParams({ search, after, before })}`

    return useSWR<MoviesApiResult>(apiUrl, fetchJson, swrProps)
}

export function useMoviesInfinite(
    search?: string,
    initialData?: MoviesApiResult
) {
    return useSWRInfiniteHelper<MoviesApiResult>(
        (data) => getMoviesApiUrl(search, data?.cursor),
        fetchJson,
        { ...swrProps, initialData: initialData ? [initialData] : undefined }
    )
}

export function getMoviesApiUrl(search?: string, after?: string) {
    return `/api/movie${queryParams({ search, after })}`
}
