export function queryParams(values: {
    [key: string]: string | undefined
}): string {
    // Domain does not matter. Only searchParams are used
    const url = new URL("http://a.a")
    for (const key in values) {
        const value = values[key]
        if (value !== undefined) {
            url.searchParams.set(key, value)
        }
    }
    return url.search
}
