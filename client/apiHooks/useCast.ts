import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type CastApiResult = {
    data: MovieType[]
}

export function useCast(cast: string | undefined, initialData?: CastApiResult) {
    const apiUrl = cast ? `/api/cast/${cast}` : null

    return useSWR<CastApiResult>(apiUrl, fetchJson, {
        ...swrProps,
        initialData,
    })
}
