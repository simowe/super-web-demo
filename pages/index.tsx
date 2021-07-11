import { useMoviesInfinite } from "client/apiHooks/useMovies"
import FetchMoreButton from "client/components/FetchMoreButton"
import MovieListSection from "client/components/MovieListSection"
import NavigationBar from "client/components/NavigationBar"
import s from "client/styles/MoviesPage.module.scss"
import { useQueryParameterState } from "client/utils/useQueryParameterState"
import Head from "next/head"
import { FC, Fragment } from "react"

const MoviesPage: FC = () => {
    const [searchQuery, setSearchQuery] = useQueryParameterState("search")

    return (
        <Fragment>
            <NavigationBar
                initialValue={searchQuery ?? ""}
                onSearch={setSearchQuery}
            />
            <main className={s.main}>
                <Head>
                    <title>Movies</title>
                </Head>
                <MoviesList searchQuery={searchQuery} />
            </main>
        </Fragment>
    )
}

export default MoviesPage

type MoviesListProps = {
    searchQuery: string | undefined
}

const MoviesList: FC<MoviesListProps> = ({ searchQuery }) => {
    const { data, fetchMore, isLoading } = useMoviesInfinite(searchQuery)

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
