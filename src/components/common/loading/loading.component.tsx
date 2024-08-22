import { Spinner } from "flowbite-react"
const LoadingComponent = ({ size = 'md' }: any) => {
    return (<>
        <Spinner aria-label="Center-aligned spinner example" size={size} />
    </>)
}
export default LoadingComponent