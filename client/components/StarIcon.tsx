import classNames from "classnames"
import { FC } from "react"
import s from "client/styles/StarIcon.module.scss"

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

export default StarIcon
