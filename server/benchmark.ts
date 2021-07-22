import { performance } from "perf_hooks"

export async function benchmark<T>(
    description: string,
    handler: () => Promise<T>
) {
    const before = performance.now()
    const result = await handler()
    console.log(description, ":", performance.now() - before, "ms")
    return result
}
