import { QRCodeCanvas } from 'qrcode.react';
import React, { useContext } from "react";
import { FaHandshake } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/auth.context";
import { LoginFirst } from "../../pages/error/login-or-signup";
import { errorNotice, successNotice } from '../../utilities/notification';
import apiService from './apiService';
import { shoppingCart } from "./cartfunction";

const Invoice: React.FC = () => {
    const auth: any = useContext(AuthContext)
    let totalItem = shoppingCart.totalCount()
    let totalCost = shoppingCart.totalCart();
    const aData: any = shoppingCart.listCart()
    const navigate = useNavigate();

    const sellers = [...new Set(aData.map((item: { sellerid: string }) => item.sellerid))];
    const Order = async () => {
        let order: any = []
        try {
            sellers.forEach(async (seller) => {
                order = []
                let items: any = [];
                aData.map((key: any) => {
                    if (key.sellerid === seller) {
                        items.push({
                            productId: key.id,
                            quantity: key.count,
                            price: key.price
                        })
                    }
                }
                );

                if (auth.loggedInUser) {
                    order.customer = auth.loggedInUser._id,
                        order.seller = seller,
                        order.items = items,
                        order.discount = '10%'
                }
                order = {
                    ...order,
                }
                await apiService.postRequest('/order', order, { auth: true })
            })
            successNotice('Order Placed Successfully.', 2000)
            await new Promise((resolve) => setTimeout(resolve, 2500));
            shoppingCart.clearCart()
            navigate('/')
        } catch (error) {
            errorNotice('Error in placing order')
        }
    }
    return (<>
        {
            auth.loggedInUser ?
                <div className=" flex gap-2 mx-16 my-2 ">
                    <div className=' w-2/3 p-5 flex flex-col gap-2 bg-white'>
                        <p className='font-semibold text-2xl text-center'>Invoice</p>
                        <hr />
                        <p>Customer Name: {auth.loggedInUser.name} </p>
                        <table id='invoice-table' >
                            <thead >
                                <tr>
                                    <th>Sn</th>
                                    <th>Particulars</th>
                                    <th>Rate</th>
                                    <th>Qty</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody >
                                {
                                    aData && aData.map((item: any, key: number) => (
                                        <tr key={key}>
                                            <td>{key + 1}</td>
                                            <td>{item.name}</td>
                                            <td className="text-right" >{item.price}</td>
                                            <td className="text-center">{item.count}</td>
                                            <td className="text-right">{item.total}</td>
                                        </tr>
                                    ))}
                                <tr>
                                    <td colSpan={3} className="text-right">
                                    </td>
                                    <td className="text-center">
                                        {totalItem} (Items)
                                    </td>
                                    <td className="text-right">
                                        Subtotal: {totalCost}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="text-right">
                                    </td>
                                    <td className="text-right">
                                        Discount 10%
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="text-right">
                                    </td>
                                    <td className="text-right  text-lg font-semibold">
                                        Total {totalCost * 0.9}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='p-5 flex flex-col gap-2 bg-white w-1/3'>
                        <p className='font-semibold text-2xl text-center'>Payment</p>
                        <hr />
                        <div className="flex justify-center p-5">
                            <QRCodeCanvas value={`"eSewa_id":"9846169569", "name":"KHUM CHHETRI", "amunt":${totalCost * 0.9}`}
                                size={256} style={{ marginTop: '20px' }} />
                        </div>
                        <hr />
                        <button onClick={(e) => {
                            e.preventDefault
                            Order()
                        }}

                            className="w-full flex   items-center justify-center gap-2 p-2 border-solid border-2 border-slate-200  rounded-lg bg-orange-400 hover:bg-blue-600 hover:text-white">
                            <FaHandshake />Pay Now</button>
                    </div>
                </div>
                : <>
                    <LoginFirst />
                </>
        }
    </>)
}
export default Invoice