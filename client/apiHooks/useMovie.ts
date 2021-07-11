import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"

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
    cast?: string[]
}

export type ImdbRating = {
    rating: number
    votes: number
    id: number
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

    const { data } = useSWR<MovieType>(apiUrl, fetchJson, {
        ...swrProps,
        initialData,
    })

    return {
        movie: data,
    }
}

export function getMovieApiUrl(id: string) {
    return `/api/movie/${id}`
}
