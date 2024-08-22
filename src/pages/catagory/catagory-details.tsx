
import { useParams, useSearchParams } from "react-router-dom";
import HomePageTitle from "../../components/common/title/home-title.component";
import { Card } from "flowbite-react";
import { useEffect } from "react";
const CatagoryDetailPage = () => {
    const params = useParams()
    const [query, setQuery] = useSearchParams()
    //    API Call to Populate

    const handleFilterClick = (price: string) => {
        setQuery({
            price: price,
        })
    }

    useEffect(() => {
        console.log(query.get('price'))
    }, [query])


    return (<>
        <HomePageTitle title={`Catagory Details of ${params.slug}`} />

        <button  className="me-3" onClick={(e) => {
            e.preventDefault()
            handleFilterClick('1000-3000')
        }}>1000-000</button>
        <button className="me-3" onClick={(e) => {
            e.preventDefault()
            handleFilterClick('4000-5000')
        }}>4000-5000</button>

        <Card className="max-w-sm" imgSrc="/images/blog/image-4.jpg" horizontal>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Noteworthy technology acquisitions 2021
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
            </p>
        </Card>
    </>);

}
export default CatagoryDetailPage