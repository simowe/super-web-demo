import useSWR from "swr"
import { fetchJson, swrProps } from "./swr"

export type CommentType = {
    name: string
    email: string
    text: string
    date: string
}

export function useComments(id: string | undefined) {
    const apiUrl = id ? `/api/movie/${id}/comments` : null

    const { data } = useSWR<CommentType[]>(apiUrl, fetchJson, swrProps)

    return {
        comments: data,
    }
}
