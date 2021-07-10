import classNames from "classnames"
import { MovieType } from "client/apiHooks/useMovie"
import { useMoviesInfinite } from "client/apiHooks/useMovies"
import NavigationBar from "client/components/NavigationBar"
import s from "client/styles/MoviesPage.module.scss"
import { useQueryParameterState } from "client/utils/useQueryParameterState"
import Head from "next/head"
import Link from "next/link"
import { FC, Fragment, memo } from "react"

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
        <MoviePage movies={data.data} isLazyLoaded={index !== 0} key={index} />
    ))

    return (
        <Fragment>
            <div className={s.movies}>{movies}</div>
            <FetchMoreButton isLoading={isLoading} fetchMore={fetchMore} />
        </Fragment>
    )
}

type MoviePageProps = {
    movies: MovieType[]
    isLazyLoaded: boolean
}

const MoviePage: FC<MoviePageProps> = memo(({ movies, isLazyLoaded }) => {
    const movieElements = movies.map((movie) => (
        <MovieCard movie={movie} lazy={isLazyLoaded} key={movie._id} />
    ))
    return <Fragment>{movieElements}</Fragment>
})

type MovieProps = {
    movie: MovieType
    lazy: boolean
}

const MovieCard: FC<MovieProps> = ({ movie, lazy }) => {
    return (
        <Link href={`/movie/${movie._id}`}>
            <a className={s.movieCard}>
                <img
                    loading={lazy ? "lazy" : "eager"}
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

type FetchMoreButtonProps = {
    isLoading: boolean
    fetchMore: VoidFunction
}

const FetchMoreButton: FC<FetchMoreButtonProps> = ({
    isLoading,
    fetchMore,
}) => {
    const buttonClass = classNames(s.fetchMore, {
        [s.fetchMore__loading]: isLoading,
    })

    return (
        <button
            className={buttonClass}
            onClick={fetchMore}
            disabled={isLoading}
        />
    )
}
