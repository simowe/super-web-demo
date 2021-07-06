import { MovieType, useMovie } from "client/apiHooks/useMovie"
import { useMovies } from "client/apiHooks/useMovies"
import NavigationBar from "client/components/NavigationBar"
import s from "client/styles/MoviesPage.module.scss"
import { useQueryParameterState } from "client/utils/useQueryParameterState"
import Head from "next/head"
import Link from "next/link"
import { FC, Fragment } from "react"

/*

Normalization:
    Normalization through useSWR initialData doesn't really work.
    Cached data is used over initialData, even though it might be older.
    useSWR doesn't know what data is fresh and what is stale.
    Maybe just accept the revalidation pattern, and abandon normalization

Instant page load:
    It's pretty sweet to have the instant load. Possible solutions

    * Data link
        * Pass the initialValue when linking to the page
    * Set value directly in swr cache.
        * It's a bit awkward because some component needs to run an updateCache function with sideeffects
        * How to reuse same cache key in a clean way. Can become a bit cumbersome to generate cache keys in multiple places.
        * Separate function for cache setting for every endpoint? Meaning multiple hooks: useMovie, useCacheMovie. Has to create a bunch of extra functions to hide the dealing with cache keys.
    

Search input with debounce:
    The flow is a bit awkward.
    Try to find a smoother information flow.
    * consider Recoil, React Hook Form, RxJS, MobX

*/

const MoviesPage: FC = () => {
    const [searchQuery, setSearchQuery] = useQueryParameterState("search")

    return (
        <Fragment>
            <NavigationBar
                initialValue={searchQuery}
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
    searchQuery: string
}

const MoviesList: FC<MoviesListProps> = ({ searchQuery }) => {
    const { data } = useMovies(searchQuery)

    if (data === undefined) return <div>loading</div>

    const movies = data.map((movie) => (
        <MovieCard movie={movie} key={movie._id} />
    ))

    return <div className={s.movies}>{movies}</div>
}

type MovieProps = {
    movie: MovieType
}

const MovieCard: FC<MovieProps> = ({ movie: movieProp }) => {
    const { data: movie } = useMovie(movieProp._id, movieProp)

    if (movie === undefined) return null

    return (
        <Link href={`/movie/${movie._id}`}>
            <a className={s.movieCard}>
                <img
                    className={s.movieCard__poster}
                    src={movie.poster}
                    alt={movie.title}
                />

                <div className={s.movieCard__description}>
                    <div className={s.movieCard__title}>{movie.title}</div>
                    <div className={s.movieCard__year}>{movie.year}</div>
                </div>
            </a>
        </Link>
    )
}
