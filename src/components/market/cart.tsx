import { useEffect, useState } from "react";
import { FaMoneyBillAlt } from "react-icons/fa";
import { useParams, useSearchParams } from "react-router-dom";
import formatToNepaliCurrency from "../../utilities/currency";
import { shoppingCart } from "./cartfunction";

const CartList = () => {
    const params = useParams()
    const [query, setQuery] = useSearchParams()
    const [aData, setAdata] = useState<any>([])

    let totalItem = shoppingCart.totalCount()
    let totalCost = shoppingCart.totalCart();


    const increaseCount = (id: string) => {
        shoppingCart.increaseCount(id)
    }
    const decreaseCount = (id: string) => {
        shoppingCart.decreaseCount(id)
    }
    const removeItem = (id: string) => {
        shoppingCart.removeFromCart(id)
    }

    useEffect(() => {
        setAdata(shoppingCart.listCart())
        setQuery({
            item: 'Shop In Nepal',
        })
    }, [])



    return (
        <div className=" flex gap-2 mx-16 my-2 ">
            <div className=' w-2/3 p-5 flex flex-col gap-2 bg-white'>
                <p className='font-semibold text-2xl text-center'>Details</p>
                <hr />
                {
                    aData && aData.map((item: any, key: number) => (
                        <div key={key} className="flex gap-5 py-2 border-b-2 border-slate-500">
                            <img
                                alt={item.image}
                                src={import.meta.env.VITE_IMAGE_URL + '/products/' + item.image}
                                className="h-40 w-40 object-cover object-center"
                            />
                            <div className="w-full flex flex-col justify-between">
                                <div>
                                    <p className="text-2xl font-semibold">{item.name}</p>
                                    <p className="text-l font-bold tracking-tight text-gray-900">{formatToNepaliCurrency(item.price)}</p>
                                    <p className="text-l font-semibold">Seller: {item.sellername}</p>
                                </div>
                                <div className="grid grid-flow-col justify-stretch">
                                    <div className=" inline-flex gap-2">
                                        <a href={`/cart`}>
                                            <button className="w-10 rounded-full border-solid border-2 text-center text-3xl"
                                                onClick={(e) => {
                                                    decreaseCount(item.id)
                                                }}
                                            > - </button>
                                        </a>
                                        <input className="w-16  text-center" type="number" disabled id='qty' name="qty" defaultValue={item.count} />
                                        <a href={`/cart`}>
                                            <button className="w-10 rounded-full border-solid border-2 text-center text-3xl"
                                                onClick={(e) => {
                                                    increaseCount(item.id)
                                                }}
                                            > + </button>
                                        </a>
                                    </div>
                                    <a href='/cart'>
                                        <button className="text-center p-2 border-solid border-2 border-slate-200  rounded-lg bg-orange-300 hover:bg-red-400"
                                            onClick={(e) => {
                                                removeItem(item.id)
                                            }}
                                        >Remove</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}

            </div>
            <div className='p-5 flex flex-col gap-2 bg-white w-1/3'>
                <p className='font-semibold text-2xl text-center'>Pricing</p>
                <hr />
                <div className="grid grid-flow-col justify-stretch">
                    <p className='text-lg font-semibold tracking-tight text-gray-500'>Price ({totalItem} Items)</p>
                    <p className='text-lg font-semibold tracking-tight text-slate-500 text-right'>{formatToNepaliCurrency(totalCost)}</p>
                </div>
                <div className="grid grid-flow-col justify-stretch">
                    <p className='text-lg font-semibold tracking-tight text-slate-400'>Discount</p>
                    <p className='text-lg font-semibold tracking-tight text-slate-400 text-right'>10%</p>
                </div>
                <div className="grid grid-flow-col justify-stretch">
                    <p className='text-lg font-semibold tracking-tight text-slate-400'>Deliver Charge</p>
                    <div className="flex justify-end">
                        <p className='text-lg font-semibold tracking-tight text-slate-400 text-right line-through'>Rs. 500</p>
                        <p className='text-lg font-semibold tracking-tight text-slate-400 text-right'> Free</p>
                    </div>
                </div>
                <hr />
                <div className="grid grid-flow-col justify-stretch p-2">
                    <p className='text-lg font-semibold tracking-tight text-gray-900'>Total Amount</p>
                    <p className='text-lg font-semibold tracking-tight text-gray-900 text-right'>{formatToNepaliCurrency(totalCost * 0.9)}</p>
                </div>
                <hr />
                <a href={`/invoice`} className="justify-end py-5">
                    <button className="w-full flex   items-center justify-center gap-2 p-2 border-solid border-2 border-slate-200  rounded-lg bg-orange-400 hover:bg-blue-600 hover:text-white">
                        <FaMoneyBillAlt />Place Order</button>
                </a>
            </div>

        </div>
    )
}
export default CartList