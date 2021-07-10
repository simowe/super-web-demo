import { useGenreInfinite } from "client/apiHooks/useGenre"
import FetchMoreButton from "client/components/FetchMoreButton"
import MovieListSection from "client/components/MovieListSection"
import s from "client/styles/MoviesPage.module.scss"
import { serializable } from "client/utils/serializable"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { fetchGenre } from "pages/api/genre/[genre]"
import { FC, Fragment } from "react"

export const getStaticProps: GetStaticProps = async (context) => {
    const genre = context.params?.genre as string
    return {
        props: {
            initialData: serializable(await fetchGenre(genre)),
        },
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

const MoviesPage: FC = () => {
    const { genre } = useRouter().query

    return (
        <Fragment>
            <main className={s.main}>
                <Head>
                    <title>Movies</title>
                </Head>
                <MoviesList genre={genre as string} />
            </main>
        </Fragment>
    )
}

export default MoviesPage

type MoviesListProps = {
    genre: string | undefined
}

const MoviesList: FC<MoviesListProps> = ({ genre }) => {
    const { data, fetchMore, isLoading } = useGenreInfinite(genre)

    if (data === undefined) return <div>loading</div>

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
