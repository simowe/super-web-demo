import { MovieType } from "client/apiHooks/useMovie"
import Link from "next/link"
import { FC, Fragment, memo } from "react"
import s from "client/styles/MoviesPage.module.scss"

type MoviePageProps = {
    movies: MovieType[]
}

const MovieListSection: FC<MoviePageProps> = memo(({ movies }) => {
    const movieElements = movies.map((movie) => (
        <MovieCard movie={movie} key={movie._id} />
    ))
    return <Fragment>{movieElements}</Fragment>
})

export default MovieListSection

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
