import { GenreApiResult, useGenreInfinite } from "client/apiHooks/useGenre"
import FetchMoreButton from "client/components/FetchMoreButton"
import MovieListSection from "client/components/MovieListSection"
import s from "client/styles/MoviesPage.module.scss"
import { InitialDataPage } from "client/types/InitialDataPage"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { FC, Fragment } from "react"

const MoviesPage: InitialDataPage<GenreApiResult> = ({ initialData }) => {
    const { genre } = useRouter().query

    return (
        <Fragment>
            <h1 className={s.pageTitle}>{genre}</h1>
            <main className={s.main}>
                <Head>
                    <title>Movies</title>
                </Head>
                <MoviesList genre={genre as string} initialData={initialData} />
            </main>
        </Fragment>
    )
}

export default MoviesPage

type MoviesListProps = {
    genre: string | undefined
    initialData?: GenreApiResult
}

const MoviesList: FC<MoviesListProps> = ({ genre, initialData }) => {
    const { data, fetchMore, isLoading, isEmpty, error } = useGenreInfinite(
        genre,
        initialData
    )

    if (error) return <div>Fucked up</div>
    if (!data) return <div>loading</div>
    if (isEmpty) return <div>Empty</div>

    const movies = data.map((data, index) => (
        <MovieListSection movies={data.data} key={index} />
    ))

    return (
        <Fragment>
            <div className={s.movies}>{movies}</div>
            <FetchMoreButton isLoading={isLoading} fetchMore={fetchMore} />
        </Fragment>
    )
}
