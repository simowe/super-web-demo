import "client/styles/globals.css"
import "firebaseConfig"
import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
export default MyApp
