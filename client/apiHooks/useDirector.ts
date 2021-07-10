import { queryParams } from "client/utils/queryParams"
import { useSWRInfiniteHelper } from "client/utils/useSWRInfiniteHelper"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type DirectorApiResult = {
    data: MovieType[]
    cursor?: string
}

export function useDirectorInfinite(director: string | undefined) {
    return useSWRInfiniteHelper<DirectorApiResult>(
        (data) => {
            if (director === undefined) return null

            return `/api/director/${director}${queryParams({
                after: data?.cursor,
            })}`
        },
        fetchJson,
        swrProps
    )
}
