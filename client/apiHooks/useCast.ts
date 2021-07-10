import { queryParams } from "client/utils/queryParams"
import {
    inArrayIfExists,
    useSWRInfiniteHelper,
} from "client/utils/useSWRInfiniteHelper"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type CastApiResult = {
    data: MovieType[]
    cursor?: string
}

export function useCastInfinite(
    cast: string | undefined,
    initialData?: CastApiResult
) {
    return useSWRInfiniteHelper<CastApiResult>(
        (data) => {
            if (cast === undefined) return null

            return `/api/cast/${cast}${queryParams({
                after: data?.cursor,
            })}`
        },
        fetchJson,
        { ...swrProps, initialData: inArrayIfExists(initialData) }
    )
}
