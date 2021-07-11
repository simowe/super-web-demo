import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type DirectorApiResult = {
    data: MovieType[]
}

export function useDirector(
    director: string | undefined,
    initialData?: DirectorApiResult
) {
    const apiUrl = director ? `/api/director/${director}` : null

    return useSWR<DirectorApiResult>(apiUrl, fetchJson, {
        ...swrProps,
        initialData,
    })
}
