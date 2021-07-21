import classNames from "classnames"
import { useAutocomplete } from "client/apiHooks/useAutocomplete"
import { MovieType } from "client/apiHooks/useMovie"
import s from "client/styles/NavigationBar.module.scss"
import Link from "next/link"
import { FC, KeyboardEvent, SyntheticEvent, useCallback, useState } from "react"

type NavigationBarProps = {
    initialValue: string
    onSearch: (value: string) => void
}

const NavigationBar: FC<NavigationBarProps> = ({ onSearch, initialValue }) => {
    const [value, setValue] = useState(initialValue)
    const [isAutocompleteVisible, setIsAutocompleteVisible] = useState(true)

    const triggerSearch = useCallback(
        (value: string) => {
            setValue(value)
            onSearch(value)
            // setIsAutocompleteVisible(false)
        },
        [onSearch]
    )

    const onChange = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }, [])

    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                triggerSearch(e.currentTarget.value)
            }
        },
        [triggerSearch]
    )

    return (
        <div className={s.container}>
            <div className={s.search}>
                <input
                    className={s.search__input}
                    placeholder="Search"
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                />
            </div>
            {isAutocompleteVisible && (
                <AutocompleteList
                    searchQuery={value}
                    onSearch={triggerSearch}
                />
            )}
        </div>
    )
}

export default NavigationBar

type AutocompleteListProps = {
    searchQuery: string
    onSearch: (value: string) => void
}

const AutocompleteList: FC<AutocompleteListProps> = ({
    searchQuery,
    onSearch,
}) => {
    const { data, error } = useAutocomplete(searchQuery)

    if (error) return null
    if (!data) return null
    if (data.data.length === 0) return null

    const autocompleteElements = data.data.map((data, index) => (
        <AutocompleteListItem onSearch={onSearch} movie={data} key={index} />
    ))

    return <div className={s.autocomplete}>{autocompleteElements}</div>
}

type AutocompleteListItemProps = {
    movie: MovieType
    onSearch: (value: string) => void
}

const AutocompleteListItem: FC<AutocompleteListItemProps> = ({
    movie,
    onSearch,
}) => {
    const itemClass = classNames(s.autocomplete_item, {
        [s.autocomplete_item__active]: false,
    })

    return (
        <Link href={`/movie/${movie._id}`}>
            <a className={itemClass}>
                <span className={s.autocomplete_itemTitle}>{movie.title}</span>
                <span className={s.autocomplete_itemYear}>({movie.year})</span>
            </a>
        </Link>
    )
}
