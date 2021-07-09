import { MovieType } from "client/apiHooks/useMovie"
import { useMoviesInfinite } from "client/apiHooks/useMovies"
import NavigationBar from "client/components/NavigationBar"
import s from "client/styles/MoviesPage.module.scss"
import { useQueryParameterState } from "client/utils/useQueryParameterState"
import Head from "next/head"
import Link from "next/link"
import { FC, Fragment, memo, useCallback } from "react"

/*

Normalization:
    Normalization through useSWR initialData doesn't really work.
    Cached data is used over initialData, even though it might be older.
    useSWR doesn't know what data is fresh and what is stale.
    Maybe just accept the revalidation pattern, and abandon normalization

Instant page load:
    It's pretty sweet to have the instant load. Possible solutions
    I have a feeling this will only be this clean in demo setups, with denormalization and duplicated data you can end up in situations where the initialData isn't the same as the endpoint.
    To some degree it's still reimplementing server logic which I'm trying to avoid. Makes assumptions about the internal data structure of the database, and that type of thing can change over time.
    With TypeScript it is clearer what the page expects. Maybe find a way for a page to accept typechecked initialData, not sent through any. Have a separate link for every page? Is that too much?

    * Data link
        * Pass the initialValue when linking to the page
    * Set value directly in swr cache.
        * It's a bit awkward because some component needs to run an updateCache function with sideeffects
        * How to reuse same cache key in a clean way. Can become a bit cumbersome to generate cache keys in multiple places.
        * Separate function for cache setting for every endpoint? Meaning multiple hooks: useMovie, useCacheMovie. Has to create a bunch of extra functions to hide the dealing with cache keys.
    

*/

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
    const { data, fetchMore } = useMoviesInfinite(searchQuery)

    if (data === undefined) return <div>loading</div>

    const movies = data.map((data, index) => (
        <MoviePage movies={data.data} key={index} />
    ))

    return (
        <Fragment>
            <div className={s.movies}>{movies}</div>
            <button onClick={fetchMore}>Load more</button>
        </Fragment>
    )
}

type MoviePageProps = {
    movies: MovieType[]
}

const MoviePage: FC<MoviePageProps> = memo(({ movies }) => {
    const movieElements = movies.map((movie) => (
        <MovieCard movie={movie} key={movie._id} />
    ))
    return <Fragment>{movieElements}</Fragment>
})

type MovieProps = {
    movie: MovieType
}

const MovieCard: FC<MovieProps> = ({ movie }) => {
    return (
        <Link href={`/movie/${movie._id}`}>
            <a className={s.movieCard}>
                <img
                    loading="lazy"
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
