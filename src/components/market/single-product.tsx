import { useEffect, useState } from "react";
import { FaMoneyBillAlt, FaShoppingCart } from "react-icons/fa";
import { useParams, useSearchParams } from "react-router-dom";
import formatToNepaliCurrency from "../../utilities/currency";
import { errorNotice } from "../../utilities/notification";
import { shoppingCart } from '../market/cartfunction';
import apiService from "./apiService";


const SingleProduct = () => {
    const params = useParams()
    const [aData, setAdata] = useState<any>([])
    let [loading, setLoading] = useState(true)
    const [query, setQuery] = useSearchParams()

    const getCategory = async () => {
        try {
            const response: any = await apiService.getRequest('/product/single/' + params.id)
            setAdata(response.result)
        } catch (exception) {
            errorNotice('Product can not be fetched.')
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCategory()
        setQuery({
            item: 'Shop In Nepal',
        })
    }, [])

    const AddCartClick = (id: string, name: string, sellerid: string, sellername: string, price: number, image: string,) => {
        shoppingCart.addToCart(id, name, sellerid, sellername, price, image, 1)
    }

    return (
        <div className="bg-white mx-16 my-2 ">
            <div className="flex gap-2">
                <div className='w-1/3 p-5 flex flex-col gap-2'>
                    <img
                        alt={aData.image}
                        src={import.meta.env.VITE_IMAGE_URL + '/products/' + aData.image}
                        className=' border-solid border-2 border-slate-100 p-3'
                    />
                    <div className="flex gap-2">
                        <a href='/cart' className='w-full'
                            onClick={() => {
                                AddCartClick(aData._id, aData.name, aData.seller._id, aData.seller.name, aData.price, aData.image)
                            }}
                        >
                            <button
                                className="w-full flex items-center justify-center gap-2 p-2 border-solid border-2 border-slate-200  rounded-lg bg-blue-200 hover:bg-blue-500 hover:text-white">
                                <FaShoppingCart />Add to Cart</button>
                        </a>
                        <a href={`/buy/${aData._id}`} className='w-full'>
                            <button className="w-full flex   items-center justify-center gap-2 p-2 border-solid border-2 border-slate-200  rounded-lg bg-blue-300 hover:bg-blue-600 hover:text-white">
                                <FaMoneyBillAlt />Buy Now</button>
                        </a>
                    </div>
                </div>
                <div className='p-5 flex flex-col gap-2'>
                    <p className='font-semibold text-4xl'>{aData.name}</p>
                    <div>
                        <p className='pt-2 text-green-700 text-xl font-semibold'>Special Price</p>
                        <p className="text-l font-bold tracking-tight text-gray-900 text-xl">{formatToNepaliCurrency(aData.price)}</p>
                    </div>
                    <p className='text-xl font-semibold tracking-tight text-gray-900'>Seller:  {aData.seller ? <> {aData.seller.name}</> : <>--</>}</p>
                    <p className='text-xl font-semibold tracking-tight text-gray-900'>Brand:  {aData.brand ? <> {aData.brand.name}</> : <>No Brand</>}</p>
                    <p className="text-xl font-semibold tracking-tight text-gray-900">
                        Details: {aData.detail}</p>
                </div>
            </div>
        </div>
    )
}
export default SingleProduct