import { queryParams } from "client/utils/queryParams"
import {
    inArrayIfExists,
    useSWRInfiniteHelper,
} from "client/utils/useSWRInfiniteHelper"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type GenreApiResult = {
    data: MovieType[]
    cursor?: string
}

export function useGenreInfinite(
    genre: string | undefined,
    initialData?: GenreApiResult
) {
    return useSWRInfiniteHelper<GenreApiResult>(
        (data) => {
            if (genre === undefined) return null
            return `/api/genre/${genre}${queryParams({ after: data?.cursor })}`
        },
        fetchJson,
        { ...swrProps, initialData: inArrayIfExists(initialData) }
    )
}
