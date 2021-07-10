import { useDirectorInfinite } from "client/apiHooks/useDirector"
import FetchMoreButton from "client/components/FetchMoreButton"
import MovieListSection from "client/components/MovieListSection"
import s from "client/styles/MoviesPage.module.scss"
import { serializable } from "client/utils/serializable"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { fetchDirector } from "pages/api/director/[director]"
import { FC, Fragment } from "react"

export const getStaticProps: GetStaticProps = async (context) => {
    const director = context.params?.director as string
    return {
        props: {
            initialData: serializable(await fetchDirector(director)),
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
    const { director } = useRouter().query

    return (
        <Fragment>
            <h1 className={s.pageTitle}>{director}</h1>
            <main className={s.main}>
                <Head>
                    <title>Movies</title>
                </Head>
                <MoviesList director={director as string} />
            </main>
        </Fragment>
    )
}

export default MoviesPage

type MoviesListProps = {
    director: string | undefined
}

const MoviesList: FC<MoviesListProps> = ({ director }) => {
    const { data, fetchMore, isLoading } = useDirectorInfinite(director)

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
