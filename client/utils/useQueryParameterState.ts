import { useCallback, useState } from "react"

type ValueType = string | undefined

export function useQueryParameterState(
    key: string,
    defaultValue: ValueType = undefined
): [string | undefined, (value?: string) => void] {
    const [state, setInternalState] = useState(
        getQueryParameter(key) ?? defaultValue
    )

    const setState = useCallback((value: ValueType) => {
        setInternalState(value)
        replaceQueryParameter(key, value)
    }, [])

    return [state, setState]
}

/*
    This is a bit hacky. Overrides Next router internals to avoid rerendering
*/
function replaceQueryParameter(key: string, value: ValueType) {
    const url = new URL(window.location.href)
    if (value === undefined || value === "") {
        url.searchParams.delete(key)
    } else {
        url.searchParams.set(key, value)
    }

    const newUrl = url.pathname + url.search
    const newState = { ...window.history.state, url: newUrl, as: newUrl }
    window.history.replaceState(newState, "", newUrl)
}

function getQueryParameter(key: string): ValueType {
    if (typeof window === "undefined") return undefined

    const url = new URL(window.location.href)
    return url.searchParams.get(key) || undefined
}
