export function getImgixUrl(imageUrl: string) {
    const originalBase = "https://m.media-amazon.com/images/M/"
    const imgixBase = "https://super-web-demo.imgix.net/"

    const replaced = imageUrl.replace(originalBase, imgixBase)

    if (!replaced.startsWith(imgixBase)) {
        throw new Error("Not valid image url")
    }

    return replaced
}
