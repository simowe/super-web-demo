import { MovieType, useMovie } from "client/apiHooks/useMovie"
import { useMovies } from "client/apiHooks/useMovies"
import NavigationBar from "client/components/NavigationBar"
import s from "client/styles/MoviesPage.module.scss"
import { debounce } from "lodash"
import Head from "next/head"
import Link from "next/link"
import { NextRouter, useRouter } from "next/router"
import { FC, Fragment, useEffect, useState } from "react"

/*

Normalization:
    Normalization through useSWR initialData doesn't really work.
    Cached data is used over initialData, even though it might be older.
    useSWR doesn't know what data is fresh and what is stale.
    Maybe just accept the revalidation pattern, and abandon normalization

Search input with debounce:
    The flow is a bit awkward.
    Try to find a smoother information flow.
    * consider Recoil, MobX, React Hook Form

*/

const MoviesPage: FC = () => {
    const [searchQuery, setSearchQuery] = useState(
        getQueryParameter("search") ?? ""
    )

    const router = useRouter()

    useEffect(() => {
        replaceQueryParameter(router, "search", searchQuery)
    }, [searchQuery])

    const debouncedSet = debounce(setSearchQuery, 500)

    return (
        <Fragment>
            <NavigationBar initialValue={searchQuery} onChange={debouncedSet} />
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

function replaceQueryParameter(router: NextRouter, key: string, value: string) {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    router.replace(url.href)
}

function getQueryParameter(key: string) {
    if (typeof window === "undefined") return null

    const url = new URL(window.location.href)
    return url.searchParams.get(key)
}

class NavigationBarState {
    searchQuery: string = getQueryParameter("search") ?? ""

    setSearchQuery = debounce((value: string) => {
        this.searchQuery = value
    }, 500)
}
