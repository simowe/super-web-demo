import { queryParams } from "client/utils/queryParams"
import { useRef } from "react"
import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export type AutocompleteApiResult = {
    data: MovieType[]
}

export function useAutocomplete(query: string) {
    const url = `/api/autocomplete${queryParams({ query })}`

    const fallbackData = useRef<AutocompleteApiResult>()

    const swr = useSWR<AutocompleteApiResult>(url, fetchJson, swrProps)

    if (swr.data !== undefined) {
        fallbackData.current = swr.data
    }

    return {
        ...swr,
        data: fallbackData.current,
    }
}
