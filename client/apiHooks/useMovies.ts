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

export function useMoviesInfinite(search?: string) {
    return useSWRInfiniteHelper<MoviesApiResult>(
        (data) => `/api/movie${queryParams({ search, after: data?.cursor })}`,
        fetchJson,
        swrProps
    )
}
