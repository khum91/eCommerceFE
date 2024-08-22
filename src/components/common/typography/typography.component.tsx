import { ReactElement } from "react"

interface HeadingProps {
    value ?: string | ReactElement,
    className?: string | null | undefined,
    children?: any

}

export const Heading1 = ({value, className, children}:HeadingProps) => {
    return (<>
        <h1 className ={`${className} font-bold text-green-800 text-center text-[28px] sm:text-[32px] md:text[38px] lg:text-[42px] xl:text-[48px]`}>{value ? value: children}</h1>
    </>)
}