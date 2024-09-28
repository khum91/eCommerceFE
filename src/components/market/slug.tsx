
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { errorNotice } from "../../utilities/notification";
import apiService from "./apiService";

const CategoryListPage = () => {
    const params = useParams()
    const [aData, setAdata] = useState([])
    let [loading, setLoading] = useState(true)

    const getCategory = async () => {
        try {
            const response: any = await apiService.getRequest('/landing')
            let Electronics: any = [];
            let Others: any = [];
            for (let i = 0; i < response.result.length; i++) {
                if (response.result[i].name === 'Electronics') {
                    Electronics = [...Electronics, response.result[i]];
                } else if (response.result[i].parent && response.result[i].parent.name === 'Electronics') {
                    Electronics = [...Electronics, response.result[i]];
                } else {
                    Others = [...Others, response.result[i]];
                }
            }
            if (params.slug === 'electronics') {
                setAdata(Electronics)
            } else {
                setAdata(Others)
            }

        } catch (exception) {
            errorNotice('Category can not be fetched.')
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCategory()
    }, [])
    return (<>
        <div className="flex flex-col items-center m-2 bg-white">
            <div className=" w-full flex flex-col gap-2 text-center  border-b border-solid border-gray-400 p-6">
                <h1 className="text-center font-semibold text-[20px]">{`Best of ${params.slug}`}</h1>
                <h1>{aData.length} Items</h1>
            </div>
            <div className="grid grid-cols-4 gap-10 m-10">
                {
                    aData && aData.map((item: any, key: number) => (
                        <div key={key} className="box-border hover:box-content group relative">
                            <a href={`/${params.slug}/${item._id}`}>
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                                    <img
                                        alt={item.image}
                                        src={import.meta.env.VITE_IMAGE_URL + '/categories/' + item.image}
                                        className=" w-25 h-25 object-cover object-center"
                                    />
                                </div>
                                <div className="p-2">
                                    <p className="text-center">{item.name}</p>
                                    <p className="text-center text-l font-bold tracking-tight text-gray-900">Shop Now !</p>
                                </div>
                            </a>
                        </div>
                    ))}
            </div>
        </div>
    </>);

}
export default CategoryListPage