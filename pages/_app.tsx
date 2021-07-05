import NavigationBar from "client/components/NavigationBar"
import "client/styles/globals.css"
import type { AppProps } from "next/app"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <div>
            <NavigationBar />
            <Component {...pageProps} />
        </div>
    )
}
export default MyApp
