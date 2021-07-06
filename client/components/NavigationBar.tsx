import s from "client/styles/NavigationBar.module.scss"
import { FC } from "react"

type NavigationBarProps = {
    initialValue: string
    onChange: (value: string) => void
}

const NavigationBar: FC<NavigationBarProps> = ({ onChange, initialValue }) => {
    return (
        <div className="container">
            <div className={s.search}>
                <input
                    defaultValue={initialValue}
                    className={s.search__input}
                    placeholder="Search"
                    onChange={(e) => onChange(e.currentTarget.value)}
                />
            </div>
        </div>
    )
}

export default NavigationBar

