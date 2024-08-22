export interface inputLabel {
    htmlFor?: string,
    children: any
}

export const InputLabel = ({ htmlFor, children }: inputLabel) => {
    return (<>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700"> {children} </label>
    </>)
}