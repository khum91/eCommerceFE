import { Card } from "flowbite-react";

const SingleProductComponent = () => {
    return (
        <>
            <Card
                className="mb -3 sm: w-full"
                imgAlt="Meaningful alt text for an image that is not purely decorative"
                imgSrc="https://static-01.daraz.com.np/p/6df819a31341258c21758ffefee46f2d.jpg"
            >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Samsung 2024
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    Here are the biggest enterprise technology.</p>
            </Card>
        </>
    )
}
export default SingleProductComponent