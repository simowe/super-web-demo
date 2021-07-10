import classNames from "classnames"
import { FC } from "react"
import s from "client/styles/MoviesPage.module.scss"

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

export default FetchMoreButton
