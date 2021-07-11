import { DirectorApiResult, useDirector } from "client/apiHooks/useDirector"
import MovieListSection from "client/components/MovieListSection"
import s from "client/styles/MoviesPage.module.scss"
import { InitialDataPage } from "client/types/InitialDataPage"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { FC, Fragment } from "react"

const MoviesPage: InitialDataPage<DirectorApiResult> = ({ initialData }) => {
    const { director } = useRouter().query

    return (
        <Fragment>
            <h1 className={s.pageTitle}>{director}</h1>
            <main className={s.main}>
                <Head>
                    <title>Movies</title>
                </Head>
                <MoviesList
                    director={director as string}
                    initialData={initialData}
                />
            </main>
        </Fragment>
    )
}

export default MoviesPage

type MoviesListProps = {
    director: string | undefined
    initialData?: DirectorApiResult
}

const MoviesList: FC<MoviesListProps> = ({ director, initialData }) => {
    const { data } = useDirector(director, initialData)

    if (data === undefined) return <div>loading</div>

    return (
        <div className={s.movies}>
            <MovieListSection movies={data.data} />
        </div>
    )
}
