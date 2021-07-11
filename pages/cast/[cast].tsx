import { CastApiResult, useCast } from "client/apiHooks/useCast"
import { DirectorApiResult } from "client/apiHooks/useDirector"
import MovieListSection from "client/components/MovieListSection"
import s from "client/styles/MoviesPage.module.scss"
import { InitialDataPage } from "client/types/InitialDataPage"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { FC, Fragment } from "react"

const MoviesPage: InitialDataPage<CastApiResult> = ({ initialData }) => {
    const { cast } = useRouter().query

    return (
        <Fragment>
            <h1 className={s.pageTitle}>{cast}</h1>
            <main className={s.main}>
                <Head>
                    <title>Movies</title>
                </Head>
                <MoviesList cast={cast as string} initialData={initialData} />
            </main>
        </Fragment>
    )
}

export default MoviesPage

type MoviesListProps = {
    cast: string | undefined
    initialData?: DirectorApiResult
}

const MoviesList: FC<MoviesListProps> = ({ cast, initialData }) => {
    const { data } = useCast(cast, initialData)

    if (data === undefined) return <div>loading</div>

    return (
        <div className={s.movies}>
            <MovieListSection movies={data.data} />
        </div>
    )
}
