import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"
import { MovieType } from "./useMovie"

export function useMovies() {
    const apiUrl = "/api/movie"

    return useSWR<MovieType[]>(apiUrl, fetchJson, swrProps)
}
