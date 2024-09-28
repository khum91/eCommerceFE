import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import bannerService from "../../pages/dashboard/banner/banner.service";
import formatToNepaliCurrency from "../../utilities/currency";
import { errorNotice } from "../../utilities/notification";

const CategoryDetailPage = () => {
    const params = useParams()
    const [aData, setAdata] = useState([])
    const [name, setName] = useState([])
    let [loading, setLoading] = useState(true)
    const [sort, setSort] = useState<string>('khum')

    const getCategory = async ({ sort }: { sort?: string | null }) => {
        try {
            const response: any = await bannerService.getRequest('/product/category/' + params.id, { params: { sort1: sort, } })
            if (response.length > 0) {
                setName(response[0].category.name)
            }
            setAdata(response)
        } catch (exception) {
            errorNotice('Category can not be fetched.')
        }
        finally {
            setLoading(false)
        }
    }

    const handleFilterClick = (sort: string) => {
        setSort(sort)
    }

    useEffect(() => {
        getCategory({ sort })
    }, [sort])
    return (<>
        <div className="bg-white p-3 m-2">
            {
                (aData.length > 0) ? <>
                    <div className="border-b border-solid border-gray-400 p-2 flex flex-col gap-2">
                        <div className=" w-full inline-flex gap-2 items-center  align-middle">
                            <h1 className=" font-semibold text-[20px]">{name} </h1>
                            <h1> ({aData.length} Products.)</h1>
                        </div>
                        <div className="flex gap-5" >
                            <p className="text-sm font-semibold ">Sort By</p>
                            <button className="text-sm font-semibold text-slate-500" onClick={(e) => {
                                e.preventDefault()
                                handleFilterClick('khum')
                            }}>Popular</button>
                            <button className="text-sm font-semibold text-slate-500" onClick={(e) => {
                                e.preventDefault()
                                handleFilterClick('price -1')
                            }}>Price-- Low to High</button>
                            <button className="text-sm font-semibold text-slate-500" onClick={(e) => {
                                e.preventDefault()
                                handleFilterClick('price 1')
                            }}>Price-- High to Low</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4 mt-4">
                        {
                            aData && aData.map((item: any, key: number) => (
                                <div key={key} className="box-border hover:box-decoration-clone group relative">
                                    <a href={`/product/${item._id}`}>
                                        <div className="aspect-h-0.5 aspect-w-0.5 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75">
                                            <img
                                                alt={item.image}
                                                src={import.meta.env.VITE_IMAGE_URL + '/products/' + item.image}
                                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                            />
                                        </div>
                                        <div className="p-2">
                                            <p className="text-center">{item.name}</p>
                                            <p className="text-center text-l font-bold tracking-tight text-gray-900">{formatToNepaliCurrency(item.price)}</p>
                                            <p className="text-center">Free Delivery</p>
                                        </div>
                                    </a>
                                </div>
                            ))}
                    </div>
                </> : <>
                    <p>No more Items found.</p>
                </>
            }
        </div>
    </>);
}
export default CategoryDetailPage