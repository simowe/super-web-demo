import { FC } from "react"
import s from "client/styles/NavigationBar.module.scss"

const NavigationBar: FC = () => {
    return (
        <div className="container">
            <div className={s.search}>
                <input className={s.search__input} placeholder="Search" />
            </div>
        </div>
    )
}

export default NavigationBar
