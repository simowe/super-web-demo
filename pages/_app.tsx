import "client/styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { Fragment } from "react"

function MyApp({ Component, pageProps }: AppProps) {
    return <Fragment>
        <Head>
            <meta httpEquiv="Strict-Transport-Security" content="max-age=60" />
            <meta name="robots" content="noindex" />
        </Head>
        <Component {...pageProps} />
    </Fragment>
}
export default MyApp
