import { FC, Fragment, ReactNode, useEffect, useRef, useState } from "react"

type IfVisibleProps = {
    fallback?: ReactNode
    onIsVisible?: VoidFunction
}

const IfVisible: FC<IfVisibleProps> = ({ children, fallback, onIsVisible }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [childrenIsVisible, setChildrenIsVisible] = useState(false)

    const onIsVisibleRef = useRef(onIsVisible)
    onIsVisibleRef.current = onIsVisible

    useEffect(() => {
        const element = ref.current
        if (element) {
            const options = {
                rootMargin: "0px",
                threshold: 0,
            }

            const observer = new IntersectionObserver((entries, observer) => {
                const isIntersecting = entries[0]?.isIntersecting
                if (isIntersecting) {
                    setChildrenIsVisible(true)
                    observer.unobserve(element)

                    if (onIsVisibleRef.current) {
                        onIsVisibleRef.current()
                    }
                }
            }, options)

            observer.observe(element)

            return () => {
                observer.unobserve(element)
            }
        }
    }, [])

    return (
        <Fragment>
            <div ref={ref} />
            {!childrenIsVisible && fallback}
            {childrenIsVisible && children}
        </Fragment>
    )
}

export default IfVisible
