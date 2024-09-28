import { useEffect, useState } from "react";
import { errorNotice } from "../../utilities/notification";
import apiService from "./apiService";

export const Category = () => {
    const [aData, setAdata] = useState([])
    const [bData, setBdata] = useState([])
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
            setAdata(Electronics)
            setBdata(Others)
        } catch (exception) {
            errorNotice('Category can not be fetched.')
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getCategory()
    }, [loading])

    return (
        (aData.length > 0 || bData.length > 0) ? <div className="flex flex-col gap-4 min-h-screen">
            <div className=" bg-white p-4 ">
                <div className="flex justify-between pb-2">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Best of Electronics</h2>
                    <a className="text-teal-800 text-l font-bold hover:cursor-pointer" href={'/category/electronics'}
                    >
                        View All &rarr;
                    </a>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {
                        aData && aData.slice(0, 5).map((item: any, key: number) => (
                            <div key={key} className="box-border hover:box-content border-2 border-green-200 group relative">
                                <a href={`/list/${item._id}`}>
                                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                                        <img
                                            alt={item.image}
                                            src={import.meta.env.VITE_IMAGE_URL + '/categories/' + item.image}
                                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
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

            <div className=" bg-white p-4 ">
                <div className="flex justify-between pb-2">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        {
                            bData && bData.slice(0, 5).map((item: any, key: number) => (
                                item.name + ' '
                            ))
                        }
                        & more</h2>
                    <a className="text-teal-800 text-l font-bold hover:cursor-pointer" href={'/category/others'}>
                        View All &rarr;
                    </a>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {
                        bData && bData.slice(0, 5).map((item: any, key: number) => (
                            <div key={key} className="box-border hover:box-content border-2 border-green-200 group relative">
                                <a href={`/list/${item._id}`}>
                                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
                                        <img
                                            alt={item.image}
                                            src={import.meta.env.VITE_IMAGE_URL + '/categories/' + item.image}
                                            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <p className="text-center">{item.name}</p>
                                        <p className="text-center text-l font-bold tracking-tight text-gray-900">Up to 40% Off</p>
                                    </div>
                                </a>
                            </div>
                        ))}
                </div>
            </div>
        </div> : <>
            <p>No more Items found.</p>
        </>
    )
}
