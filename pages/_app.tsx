import "client/styles/globals.css"
import "common/firebaseConfig"
import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
export default MyApp
