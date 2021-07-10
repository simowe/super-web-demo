import useSWR from "swr"
import { fetchJson } from "./swr"

export type MovieType = {
    _id: string
    title: string
    year: number
    runtime: number
    rated: string
    plot: string
    poster: string
    imdb: ImdbRating
    tomatoes: RottenTomatesRating
    genres: string[]
    directors?: string[]
    writers?: string[]
}

export type ImdbRating = {
    rating: number
    votes: number
}

export type RottenTomatesRating = {
    fresh: number
    rotten: number
    critic: {
        meter: number
        numReviews: number
        rating: number
    }
    consensus: string
}

export function useMovie(id: string | undefined, initialData?: MovieType) {
    const apiUrl = id ? `/api/movie/${id}` : null

    return useSWR<MovieType>(apiUrl, fetchJson, {
        initialData,
    })
}

export function getMovieApiUrl(id: string) {
    return `/api/movie/${id}`
}
