import classNames from "classnames"
import { MovieType, useMovie } from "client/apiHooks/useMovie"
import { useMyRating } from "client/apiHooks/useMyRating"
import s from "client/styles/MoviePage.module.scss"
import { InitialDataPage } from "client/types/InitialDataPage"
import { serializable } from "client/utils/serializable"
import { range } from "lodash"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import Link from "next/link"
import { fetchMovie } from "pages/api/movie/[movieId]"
import { FC } from "react"

export const getStaticProps: GetStaticProps = async (context) => {
    const movieId = context.params?.movieId as string
    return {
        props: {
            initialData: serializable(await fetchMovie(movieId)),
        },
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

const MoviePage: InitialDataPage<MovieType> = ({ initialData }) => {
    const { movieId } = useRouter().query
    const { movie } = useMovie(movieId as string | undefined, initialData)

    if (movie === undefined) {
        return <div className={s.loading}>Loading</div>
    }

    return (
        <main className={s.main}>
            <Link href="/">
                <a className={s.goHome}>Home</a>
            </Link>
            <Head>
                <title>{movie.title}</title>
            </Head>
            <div className={s.container}>
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
                    />
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
                    {movie.rated ?? "Unrated"}
                </div>
                <div className={s.titleBar__subSegment}>{movie.runtime}min</div>
            </div>
        </div>
    )
}

const MovieDescription: FC<MovieProps> = ({ movie }) => {
    const genres = movie.genres.map((genre) => (
        <Link href={`/genre/${genre}`} key={genre}>
            <a className={s.genres__genre}>{genre}</a>
        </Link>
    ))

    return (
        <div className={s.description}>
            <div className={s.genres}>{genres}</div>
            <div className={s.plot}>{movie.plot}</div>
            <MyRating movie={movie} />
            <ImdbRating movie={movie} />
            <Directors directors={movie.directors} />
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

const MyRating: FC<MovieProps> = ({ movie }) => {
    const { myRating, updateRating } = useMyRating(movie._id)

    const starElements = range(0, 10).map((_, index) => (
        <StarIcon
            key={index}
            isActive={index < (myRating?.rating ?? 0)}
            onClick={() => updateRating(index + 1)}
        />
    ))

    return <div className={s.myRating}>{starElements}</div>
}

type DirectorsProps = {
    directors?: string[]
}

const Directors: FC<DirectorsProps> = ({ directors = [] }) => {
    if (directors.length === 0) return null

    const directorElements = directors.map((director) => (
        <Link href={`/director/${director}`} key={director}>
            <a className={s.credit__name}>{director}</a>
        </Link>
    ))

    return (
        <div className={s.credit}>
            <div className={s.credit__title}>Directors</div>
            {directorElements}
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

type StarIconProps = {
    isActive?: boolean
    onClick?: VoidFunction
}

const StarIcon: FC<StarIconProps> = ({ isActive = true, onClick }) => {
    const starClass = classNames(s.star, { [s.star__active]: isActive })
    return (
        <svg
            onClick={onClick}
            className={starClass}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="presentation"
        >
            <path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path>
        </svg>
    )
}
