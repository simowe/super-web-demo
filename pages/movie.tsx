import { MovieType, useMovie } from "client/apiHooks/useMovie"
import { useMovies } from "client/apiHooks/useMovies"
import s from "client/styles/MoviesPage.module.scss"
import Link from "next/link"
import { FC } from "react"
import Head from "next/head"

const MoviesPage: FC = () => {
    return (
        <main className="container">
            <Head>
                <title>Movies</title>
            </Head>
            <MoviesList />
        </main>
    )
}

export default MoviesPage

const MoviesList: FC = () => {
    const { data } = useMovies()

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
