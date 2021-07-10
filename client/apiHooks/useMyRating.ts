import useSWR from "swr"
import { fetchJsonAuth, swrProps } from "./swr"

export type RatingType = {
    rating: number
}

export function useMyRating(id: string | undefined) {
    const apiUrl = id ? `/api/movie/${id}/my_rating` : null

    return useSWR<RatingType>(apiUrl, fetchJsonAuth, {
        ...swrProps,
    })
}
