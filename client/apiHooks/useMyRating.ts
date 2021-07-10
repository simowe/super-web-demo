import { useCallback } from "react"
import useSWR from "swr"
import { fetchJsonAuth, getAuthHeaders, swrProps } from "./swr"

export type RatingType = {
    rating: number
}

export function useMyRating(id: string | undefined) {
    const apiUrl = id ? `/api/movie/${id}/my_rating` : null

    const { mutate, data } = useSWR<RatingType>(apiUrl, fetchJsonAuth, swrProps)

    const updateRating = useCallback(
        async (rating: number) => {
            if (apiUrl === null) return

            mutate({ rating }, false)
            mutate(rateMovie(apiUrl, rating), false)
        },
        [mutate, apiUrl]
    )

    return {
        myRating: data,
        updateRating,
    }
}

async function rateMovie(apiUrl: string, rating: number) {
    const params: RequestInit = {
        method: "PUT",
        ...getAuthHeaders(),
        body: JSON.stringify({ rating }),
    }

    return fetch(apiUrl, params).then((result) => result.json())
}
