import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export function useMovies(searchQuery?: string) {
    const apiUrl = `/api/movie?search=${searchQuery ?? null}`

    return useSWR<MovieType[]>(apiUrl, fetchJson, swrProps)
}
