import { yupResolver } from '@hookform/resolvers/yup'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import {
    CancelButton,
    DropdownComponent,
    ImageUpload,
    NumberInputComponent,
    SubmitButton,
    TextAreaInputComponent,
    TextInputCapital
} from '../../../components/common/form/input-component'
import { InputLabel } from '../../../components/common/form/label-component'
import dashboardService from "../../../services/service"
import AuthContext from '../../../context/auth.context'
import { errorNotice, successNotice } from '../../../utilities/notification'


const ProductCreate = () => {
    const productDTO = Yup.object({
        name: Yup.string().min(2).required(),
        seller: Yup.string().required(),
        category: Yup.string().required(),
        brand: Yup.string(),
        detail: Yup.string().min(2).required(),
        status: Yup.string().required(),
        price: Yup.number().required(),
        image: Yup.mixed().required()
    })
    const [brand, setBrand] = useState()
    const [seller, setSeller] = useState()
    const [category, setCategory] = useState()
    const [loading, setLoading] = useState<boolean>()
    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(productDTO)
    })
    const navigate = useNavigate();
    const auth: any = useContext(AuthContext)
    const user = auth.loggedInUser

    const getOptions = async () => {
        try {
            const options: any = await dashboardService.getRequest('/product/options', { auth: true })

            //seller
            let seller: any = []
            if (user.role = 'seller') {
                seller.push({ label: user.name, value: user._id })
            } else {
                const oseller: any = Object.values(options.seller)
                oseller.map((key: any) => seller.push({
                    label: key.name,
                    value: key._id
                }));

            }
            setSeller(seller)
            //category
            const ocategory: any = Object.values(options.category)
            let category: any = []
            ocategory.map((key: any) => category.push({
                label: key.name,
                value: key._id
            }));
            setCategory(category)

            //brand
            const obrand: any = Object.values(options.brand)
            let brand: any = []
            obrand.map((key: any) => brand.push({
                label: key.name,
                value: key._id
            }));
            setBrand(brand)
        } catch (error) {
            throw error
        }

    }

    useEffect(() => {
        getOptions();
    }, [])
    const resetEvent = () => {
        navigate('/dashboard/product')
    }

    const submitEvent = async (data: any) => {
        setLoading(true)
        try {
            await dashboardService.postRequest('/product', data, { auth: true, file: true })
            successNotice('Product created successfully.')
            navigate('/dashboard/product')
        } catch (exception: any) {
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                errorNotice('Product can not be created at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>
        <div className="w-full min-h-screen bg-white p-5">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white text-center">Add a New Product</h2>
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
                            <DropdownComponent
                                name='seller'
                                label='Select Seller'
                                options={seller}
                                control={control}
                                msg={errors?.seller?.message}
                            />
                        </div>

                        <div className="inline-flex gap-1 items-center">
                            <InputLabel htmlFor='category'>Category: </InputLabel>
                            <DropdownComponent
                                name='category'
                                label='Select Category'
                                options={category}
                                control={control}
                                msg={errors?.category?.message}
                            />
                        </div>
                        <div className="inline-flex gap-1 items-center">
                            <InputLabel htmlFor='brand'>Brand: </InputLabel>
                            <DropdownComponent
                                name='brand'
                                label='Select Brand'
                                options={brand}
                                control={control}
                                msg={errors?.brand?.message}
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
                        />
                    </div>
                </div>
                <div className=" flex gap-4 justify-center">
                    <CancelButton loading={loading as boolean} btnText='Cancel' />
                    <SubmitButton loading={loading as boolean} btnText='Add Product' />
                </div>
            </form >
        </div>
    </>)
}
export default ProductCreate