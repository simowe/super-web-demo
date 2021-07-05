import { MovieType, useMovie } from "client/apiHooks/useMovie"
import s from "client/styles/MoviePage.module.scss"
import { useRouter } from "next/dist/client/router"
import { FC } from "react"
import Head from "next/head"

const MoviePage: FC = () => {
    const { movieId } = useRouter().query

    const { data: movie } = useMovie(movieId as string | undefined)

    if (movie === undefined) {
        return (
            <main className={s.main}>
                <div className={s.loading}>Loading</div>
            </main>
        )
    }

    return (
        <main className={s.main}>
            <Head>
                <title>{movie.title}</title>
            </Head>
            <div className="container">
                <MovieDetails movie={movie} />
            </div>
        </main>
    )
}

export default MoviePage

type MovieProps = {
    movie: MovieType
}

const MovieDetails: FC<MovieProps> = ({ movie }) => {
    return (
        <div className={s.movieDetails}>
            <TitleBar movie={movie} />
            <div className={s.posterDescriptionSplit}>
                <div className={s.poster}>
                    <img
                        className={s.poster__img}
                        src={movie.poster}
                        alt={movie.title}
                    ></img>
                </div>
                <MovieDescription movie={movie} />
            </div>
        </div>
    )
}

const TitleBar: FC<MovieProps> = ({ movie }) => {
    return (
        <div className={s.titleBar}>
            <div className={s.titleBar__main}>{movie.title}</div>
            <div className={s.titleBar__sub}>
                <div className={s.titleBar__subSegment}>{movie.year}</div>
                <div className={s.titleBar__subSegment}>
                    {movie.rated ?? "U"}
                </div>
                <div className={s.titleBar__subSegment}>{movie.runtime}</div>
            </div>
        </div>
    )
}

const MovieDescription: FC<MovieProps> = ({ movie }) => {
    const genres = movie.genres.map((genre) => (
        <div className={s.genres__genre} key={genre}>
            {genre}
        </div>
    ))

    return (
        <div className={s.description}>
            <div className={s.genres}>{genres}</div>
            <div className={s.plot}>{movie.plot}</div>
            <ImdbRating movie={movie} />
            <Credit title="Director" name={movie.directors.join(", ")} />
            <Credit title="Writer" name={movie.writers?.join(", ")} />
        </div>
    )
}

const ImdbRating: FC<MovieProps> = ({ movie }) => {
    const { rating, votes } = movie.imdb
    return (
        <div className={s.imdbRating}>
            <StarIcon />
            <div className={s.imdbRating__rating}>{rating}</div>/
            <div className={s.imdbRating__total}>10</div>
            <div className={s.imdbRating__votes}>{votes} votes</div>
        </div>
    )
}

type CreditProps = {
    title: string
    name: string | undefined
}

const Credit: FC<CreditProps> = ({ title, name }) => {
    if (name === undefined) return null

    return (
        <div className={s.credit}>
            <div className={s.credit__title}>{title}</div>
            <div className={s.credit__name}>{name}</div>
        </div>
    )
}

const StarIcon: FC = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={s.imdbRating__star}
            role="presentation"
        >
            <path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path>
        </svg>
    )
}
