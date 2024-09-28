import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import dashboardService from '../../../services/service'
import formatToNepaliCurrency from '../../../utilities/currency'
import { InputLabel } from '../../../components/common/form/label-component'
import { errorNotice, successNotice } from '../../../utilities/notification'
import { CancelButton, SelectComponent, SubmitButton } from '../../../components/common/form/input-component'


const orderStates = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' },
];
const payentStates = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Failed', label: 'Failed' },
];

const validationSchema = Yup.object().shape({
    orderStatus: Yup.mixed().required('Order state is required'),
    paymentStatus: Yup.mixed().required('Payment state is required'),
});

const OrderEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>([])
    const [items, setItems] = useState<any>()
    const [loading, setLoading] = useState<boolean>()
    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const getOrderDetail = async () => {
        try {
            const response: any = await dashboardService.getRequest('/order/' + params.id, { auth: true })
            setOrder(response.result)
            setItems(response.result.items)
            setValue('paymentStatus', [{ label: response.result.paymentStatus, value: response.result.paymentStatus }])
            setValue('orderStatus', [{ label: response.result.orderStatus, value: response.result.orderStatus }])
        } catch (exception) {
            errorNotice('Order can not be fetched.')
            navigate('/dashboard/order')
        }
    };

    useEffect(() => {
        getOrderDetail();
    }, [params])

    const resetEvent = () => {
        navigate('/dashboard/order')
    }

    const submitEvent = async (data: any) => {
        try {
            data = {
                paymentStatus: data.paymentStatus.value,
                orderStatus: data.orderStatus.value,
            }
            await dashboardService.putRequest('/order/' + params.id, data, { auth: true, file: false })
            successNotice('Order edited successfully.')
            navigate('/dashboard/order')
        } catch (exception: any) {
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                console.log(exception)
                errorNotice('Order can not be edited at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>
        <div className='p-5  bg-white'>
            <p className='font-semibold text-2xl text-center'>Details</p>
            <hr />
            <div className='flex justify-items-start gap-10'>
                <div className='flex gap-2'>
                    <p className="text-l font-semibold">Order Number:</p>
                    <p className="text-l">{order._id}</p>
                </div>
                <div className='flex gap-2'>
                    <p className="text-l font-semibold">Customer Name:</p>
                    <p className="text-l">{order.customer?.name}</p>
                </div>
            </div>
        </div>
        <div className=" flex gap-2  my-2 ... ring-2 ring-green-300 rounded">
            <div className=' w-2/3 p-5 flex flex-col gap-2 bg-white'>
                <p className='font-semibold text-2xl text-center'>Items</p>
                <hr />
                {

                    <table id='invoice-table'>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Rate</th>
                                <th>Qty</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items && items.map((item: any, key: number) => (
                                    <tr key={key}>
                                        <td >
                                            <img
                                                alt={item.productId.image}
                                                src={import.meta.env.VITE_IMAGE_URL + '/products/' + item.productId.image}
                                                className="h-20 w-20 object-cover object-center"
                                            />
                                        </td>
                                        <td>
                                            {item.productId.name}
                                        </td>
                                        <td className='text-right'>
                                            {formatToNepaliCurrency(item.price)}
                                        </td>
                                        <td className='text-center'>
                                            {item.quantity}
                                        </td>
                                        <td className='text-right'>
                                            {formatToNepaliCurrency(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                }
            </div>
            <div className='w-1/3 p-5 flex flex-col gap-2 bg-white'>
                <p className='font-semibold text-2xl text-center'>Actions</p>
                <hr />
                <form onSubmit={handleSubmit(submitEvent)} onReset={resetEvent}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        < div className="sm:col-span-2">
                            <InputLabel htmlFor='paymentStatus'>Payment Status:</InputLabel>
                            <SelectComponent
                                options={payentStates}
                                control={control}
                                name='paymentStatus'
                                msg={errors?.paymentStatus?.message}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        < div className="sm:col-span-2">
                            <InputLabel htmlFor='status'>Order Status:</InputLabel>
                            <SelectComponent
                                options={orderStates}
                                control={control}
                                name='orderStatus'
                                // defaultValue='active'
                                msg={errors?.orderStatus?.message}
                            />
                        </div>
                    </div>

                    <div className='inline-flex items-center gap-5'>
                        <CancelButton loading={loading as boolean} btnText='Cancel' />
                        <SubmitButton loading={loading as boolean} btnText='Update' />
                    </div>
                </form>
            </div>

        </div >
    </>)
}
export default OrderEdit