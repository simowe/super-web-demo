import { queryParams } from "client/utils/queryParams"
import {
    inArrayIfExists,
    useSWRInfiniteHelper,
} from "client/utils/useSWRInfiniteHelper"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type GenreApiResult = {
    data: MovieType[]
    cursor: string | null
}

export function useGenreInfinite(
    genre: string | undefined,
    initialData?: GenreApiResult
) {
    const getUrl = (data: GenreApiResult | null) => {
        if (genre === undefined) return null
        if (data?.cursor === null) return null
        return `/api/genre/${genre}${queryParams({ after: data?.cursor })}`
    }

    return useSWRInfiniteHelper<GenreApiResult>(getUrl, fetchJson, {
        ...swrProps,
        initialData: inArrayIfExists(initialData),
    })
}
