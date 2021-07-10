import { loginWithFirebase } from "client/login"
import s from "client/styles/NavigationBar.module.scss"
import { useDebouncedSearchInput } from "client/utils/useDebouncedSearchInput"
import { FC } from "react"

type NavigationBarProps = {
    initialValue: string
    onSearch: (value: string) => void
}

const NavigationBar: FC<NavigationBarProps> = ({ onSearch, initialValue }) => {
    return (
        <div className={s.container}>
            <div className={s.search}>
                <input
                    className={s.search__input}
                    placeholder="Search"
                    defaultValue={initialValue}
                    {...useDebouncedSearchInput(onSearch, 500)}
                />
            </div>
            <button className={s.loginButton} onClick={loginWithFirebase}>
                Log in
            </button>
        </div>
    )
}

export default NavigationBar
