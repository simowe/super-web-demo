export function serializable(thing: any) {
    return JSON.parse(JSON.stringify(thing))
}
