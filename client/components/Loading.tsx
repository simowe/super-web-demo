import classNames from "classnames"
import s from "client/styles/Loading.module.scss"
import { FC } from "react"

type LoadingProps = {
    isLoading?: boolean
}

const Loading: FC<LoadingProps> = ({ isLoading = true }) => {
    const loadingClass = classNames(s.loading, {
        [s.loading__active]: isLoading,
    })
    return <div className={loadingClass} />
}

export default Loading
