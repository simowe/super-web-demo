import { CommentType, useComments } from "client/apiHooks/useComments"
import { MovieType, useMovie } from "client/apiHooks/useMovie"
import { useMyRating } from "client/apiHooks/useMyRating"
import IfVisible from "client/components/IfVisible"
import Loading from "client/components/Loading"
import StarIcon from "client/components/StarIcon"
import s from "client/styles/MoviePage.module.scss"
import { InitialDataPage } from "client/types/InitialDataPage"
import { getImgixUrl } from "client/utils/imgix"
import { serializable } from "client/utils/serializable"
import { range } from "lodash"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import Link from "next/link"
import { fetchMovie } from "pages/api/movie/[movieId]"
import { FC, Fragment, memo } from "react"

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
            <div className={s.background}>
                <div className={s.container}>
                    <MovieDetails movie={movie} />
                </div>
            </div>

            <IfVisible fallback={<Loading />}>
                <div className={s.container}>
                    <div className={s.comments}>
                        <Comments movie={movie} />
                    </div>
                </div>
            </IfVisible>
        </main>
    )
}

export default MoviePage

type MovieProps = {
    movie: MovieType
}

const MovieDetails: FC<MovieProps> = ({ movie }) => {
    return (
        <Fragment>
            <TitleBar movie={movie} />
            <div className={s.posterDescriptionSplit}>
                <img
                    className={s.poster}
                    src={getImgixUrl(movie.poster)}
                    alt={movie.title}
                />
                <MovieDescription movie={movie} />
            </div>
        </Fragment>
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
            <Cast cast={movie.cast} />
            <Credit title="Writer" name={movie.writers?.join(", ")} />
        </div>
    )
}

const ImdbRating: FC<MovieProps> = ({ movie }) => {
    const { rating, votes, id } = movie.imdb
    const paddedId = ("0000000" + id).substr(-7)
    const imdbUrl = `https://www.imdb.com/title/tt${paddedId}`
    return (
        <a
            className={s.imdbRating}
            href={imdbUrl}
            target="_blank"
            rel="noreferrer"
        >
            <StarIcon />
            <div className={s.imdbRating__rating}>{rating}</div>/
            <div className={s.imdbRating__total}>10</div>
            <div className={s.imdbRating__votes}>{votes} votes</div>
        </a>
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

type CastProps = {
    cast?: string[]
}

const Cast: FC<CastProps> = ({ cast = [] }) => {
    if (cast.length === 0) return null

    const directorElements = cast.map((cast) => (
        <Link href={`/cast/${cast}`} key={cast}>
            <a className={s.credit__name}>{cast}</a>
        </Link>
    ))

    return (
        <div className={s.credit}>
            <div className={s.credit__title}>Cast</div>
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

const Comments: FC<MovieProps> = memo(({ movie }) => {
    const { comments } = useComments(movie._id)

    if (comments === undefined) return null
    if (comments.length === 0) return <h2>No comments</h2>

    const commentElements = comments.map((comment, index) => (
        <Comment comment={comment} key={index} />
    ))

    return (
        <Fragment>
            <h2>Comments</h2>
            {commentElements}
        </Fragment>
    )
})

type CommentProps = {
    comment: CommentType
}

const Comment: FC<CommentProps> = ({ comment }) => {
    return (
        <div className={s.comment}>
            <div className={s.comment__name}>{comment.name}</div>
            <div className={s.comment__date}>{formatData(comment.date)}</div>
            <div className={s.comment__text}>{comment.text}</div>
        </div>
    )
}

function formatData(date: string) {
    return new Intl.DateTimeFormat([], {
        dateStyle: "full",
    }).format(new Date(date))
}
