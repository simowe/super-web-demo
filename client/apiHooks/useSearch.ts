import { queryParams } from "client/utils/queryParams"
import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type SearchApiResult = {
    data: MovieType[]
}

export function useSearch(query: string) {
    const url = `/api/search${queryParams({ query })}`
    return useSWR<SearchApiResult>(url, fetchJson, swrProps)
}
