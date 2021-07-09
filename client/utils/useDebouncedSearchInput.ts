import { debounce } from "lodash"
import { KeyboardEvent, useCallback, useMemo, useRef } from "react"

/*
I'm pretty happy about the current solution, as all the complexity is contained within this file. The actual use is very clean.
Still there might be better ways to do this.
Maybe research other libraries:
* Recoil
* React Hook Form
* RxJS
* MobX

*/

export function useDebouncedSearchInput(
    onSearch: (value: string) => void,
    delay: number
) {
    const ref = useRef<HTMLInputElement>(null)
    const onSearchRef = useRef(onSearch)
    onSearchRef.current = onSearch

    const triggerOnSearch = useCallback(() => {
        if (ref.current) {
            onSearchRef.current(ref.current.value)
        }
    }, [])

    const onChange = useMemo(
        () => debounce(triggerOnSearch, delay),
        [triggerOnSearch, delay]
    )

    const onKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                triggerOnSearch()
            }
        },
        [triggerOnSearch]
    )

    return {
        ref,
        onChange,
        onKeyDown,
    }
}
