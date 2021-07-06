import { useCallback, useState } from "react"

export function useQueryParameterState(
    key: string,
    defaultValue: string = ""
): [string, (value: string) => void] {
    const [state, setInternalState] = useState(
        getQueryParameter(key) ?? defaultValue
    )

    const setState = useCallback((value: string) => {
        setInternalState(value)
        replaceQueryParameter(key, value)
    }, [])

    return [state, setState]
}

/*
    This is a bit hacky. Overrides Next router internals to avoid rerendering
*/
function replaceQueryParameter(key: string, value: string) {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)

    const newUrl = url.pathname + url.search
    const newState = { ...window.history.state, url: newUrl, as: newUrl }
    window.history.replaceState(newState, "", newUrl)
}

function getQueryParameter(key: string) {
    if (typeof window === "undefined") return null

    const url = new URL(window.location.href)
    return url.searchParams.get(key)
}
