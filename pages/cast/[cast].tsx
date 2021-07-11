import { CastApiResult, useCastInfinite } from "client/apiHooks/useCast"
import { DirectorApiResult } from "client/apiHooks/useDirector"
import FetchMoreButton from "client/components/FetchMoreButton"
import MovieListSection from "client/components/MovieListSection"
import s from "client/styles/MoviesPage.module.scss"
import { InitialDataPage } from "client/types/InitialDataPage"
import { serializable } from "client/utils/serializable"
import { GetServerSideProps } from "next"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { fetchCast } from "pages/api/cast/[cast]"
import { FC, Fragment } from "react"

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cast = context.params?.cast as string
    return {
        props: {
            initialData: serializable(await fetchCast(cast)),
        },
    }
}

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
    const { data, fetchMore, isLoading } = useCastInfinite(cast, initialData)

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
