import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import dashboardService from "../../../services/service"
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import LoadingComponent from '../../../components/common/loading/loading.component'
import { InputLabel } from '../../../components/common/form/label-component'
import {
    SubmitButton, CancelButton, TextInputCapital, DropdownComponent, NumberInputComponent,
    TextAreaInputComponent, ImageUpload, SelectComponent
} from '../../../components/common/form/input-component'
import { successNotice, errorNotice } from '../../../utilities/notification'

const ProductEdit = () => {
    const productDTO = Yup.object({
        name: Yup.string().min(2).required(),
        seller: Yup.mixed().required(),
        category: Yup.mixed().required(),
        brand: Yup.mixed(),
        detail: Yup.string().required(),
        status: Yup.string().required(),
        price: Yup.number().required(),
        image: Yup.mixed().required()
    })

    const params = useParams();
    const navigate = useNavigate();
    const [brand, setBrand] = useState()
    const [seller, setSeller] = useState()
    const [category, setCategory] = useState()
    const [detail, setDetail] = useState<any>()
    const [loading, setLoading] = useState<boolean>()
    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(productDTO)
    })

    const getProductDetail = useCallback(async () => {
        try {
            const response: any = await dashboardService.getRequest('/product/' + params.id, { auth: true })
            if (response.result == 'notallowed') {
                errorNotice('You cannot modify entities created by others', 3000)
                navigate('/dashboard/product')
                return
            }
          
            let productDetail = {
                ...response.result,
                image: import.meta.env.VITE_IMAGE_URL + '/products/' + response.result.image
            }
            setDetail(productDetail);
            const options: any = await dashboardService.getRequest('/product/options', { auth: true })
            setValue('name', response.result.name)
            setValue('status', response.result.status)
            setValue('image', response.result.image)
            setValue('price', response.result.price)
            setValue('detail', response.result.detail)
            setValue('seller', [{ label: response.result.seller.name, value: response.result.seller._id }])
            setValue('category', [{ label: response.result.category.name, value: response.result.category._id }])
            //   //brand
            if (response.result.brand) {
                setValue('brand', [{ label: response.result.brand.name, value: response.result.brand._id }])
            }

            // seller
            const selleroptions: any = Object.values(options.seller);
            let opt: any = [];
            selleroptions.map((key: any) => opt.push({
                label: key.name,
                value: key._id
            }));
            setSeller(opt)

            // category
            const categoryoptions: any = Object.values(options.category);
            let opt1: any = [];
            categoryoptions.map((key: any) => opt1.push({
                label: key.name,
                value: key._id
            }));
            setCategory(opt1)

            // brand
            const brandoptions: any = Object.values(options.brand);
            let opt2: any = [];
            brandoptions.map((key: any) => opt2.push({
                label: key.name,
                value: key._id
            }));
            setBrand(opt2)
            setLoading(false)
        } catch (exception) {
            errorNotice('Product can not be fetched.')
            navigate('/dashboard/product')
        }
    }, [params])

    useEffect(() => {
        getProductDetail();
    }, [params])

    const resetEvent = () => {
        navigate('/dashboard/product')
    }

    const submitEvent = async (data: any) => {
        console.log(data)
        const a = (data.seller) ? (data.seller)[0].value : null;
        const b = (data.category) ? (data.category).value : null;
        const c = (data.brand) ? (data.brand).value : null;
        console.log(a, b,c)
        try {
            data = {
                ...data,
                seller: a,
                category: b,
                brand: c
            }
            if (typeof data.image !== 'object') {
                delete data.image
            }
            await dashboardService.putRequest('/product/' + params.id, data, { auth: true, file: true })
            successNotice('Product edited successfully.')
            navigate('/dashboard/product')
        } catch (exception: any) {
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                console.log(exception)
                errorNotice('Product can not be edited at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>
        <div className="w-full min-h-screen bg-white p-5">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white text-center">Edit Product</h2>
            {
                loading ? <>
                    <LoadingComponent />
                </> : <>
                    <form onSubmit={handleSubmit(submitEvent)} onReset={resetEvent} className='bg-slate-200 p-5 ... ring-2 ring-green-300 rounded'>
                        <div className='w-full inline-flex items-center gap-8'>
                            <div className="mb-2 w-full  flex flex-col gap-5">
                                <div className="inline-flex gap-1 items-center">
                                    <InputLabel htmlFor='name'>Name: </InputLabel>
                                    <TextInputCapital
                                        name='name'
                                        control={control}
                                        msg={errors?.name?.message}
                                    />
                                </div>
                                <div className="inline-flex gap-1 items-center">
                                    <InputLabel htmlFor='seller'>Seller: </InputLabel>
                                    <SelectComponent
                                        options={seller}
                                        control={control}
                                        name='seller'
                                        defaultValue=''
                                        msg={errors?.seller?.message}
                                    />
                                </div>

                                <div className="inline-flex gap-1 items-center">
                                    <InputLabel htmlFor='category'>Category: </InputLabel>
                                    <SelectComponent
                                        options={category}
                                        control={control}
                                        name='category'
                                        defaultValue=''
                                        msg={errors?.category?.message}
                                    />
                                </div>
                                <div className="inline-flex gap-1 items-center">
                                    <InputLabel htmlFor='brand'>Brand: </InputLabel>
                                    <SelectComponent
                                        options={brand}
                                        control={control}
                                        name='brand'
                                    />
                                </div>

                                <div className="inline-flex gap-1 items-center">
                                    <InputLabel htmlFor='detail'>Details: </InputLabel>
                                    <TextAreaInputComponent
                                        name="detail"
                                        control={control}
                                        msg={errors?.detail?.message}
                                    />
                                </div>

                                <div className="inline-flex gap-1 items-center">
                                    <InputLabel htmlFor='status'>Status:</InputLabel>
                                    <DropdownComponent
                                        name='status'
                                        label='Select Status'
                                        options={[{ label: 'Published', value: 'active' }, { label: 'Un-Published', value: 'inactive' }]}
                                        control={control}
                                        msg={errors?.status?.message}
                                    />
                                </div>

                                <div className="inline-flex gap-1 items-center">
                                    <InputLabel htmlFor='price'>Price: </InputLabel>
                                    <NumberInputComponent
                                        name='price'
                                        control={control}
                                        msg={errors?.price?.message}
                                    />
                                </div>
                            </div>
                            <div className="w-full">
                                <ImageUpload
                                    name='image'
                                    msg={errors?.image?.message}
                                    setValue={setValue}
                                    imageUrl={detail && detail.image}
                                />
                            </div>
                        </div>
                        <div className=" flex gap-4 justify-center">
                            <CancelButton loading={loading as boolean} btnText='Cancel' />
                            <SubmitButton loading={loading as boolean} btnText='Edit Product' />
                        </div>
                    </form >
                </>
            }
        </div>
    </>)
}
export default ProductEdit