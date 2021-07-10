import { queryParams } from "client/utils/queryParams"
import { useSWRInfiniteHelper } from "client/utils/useSWRInfiniteHelper"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type MoviesApiResult = {
    data: MovieType[]
    cursor?: string
}

export function useMoviesInfinite(
    search?: string,
    initialData?: MoviesApiResult
) {
    return useSWRInfiniteHelper<MoviesApiResult>(
        (data) => `/api/movie${queryParams({ search, after: data?.cursor })}`,
        fetchJson,
        { ...swrProps, initialData: initialData ? [initialData] : undefined }
    )
}
