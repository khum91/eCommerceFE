import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { InputLabel } from '../../../components/common/form/label-component'
import {
    SelectComponent, SingleImageUpload,
    SubmitButton, CancelButton, TextInputCapital, DropdownComponent,
} from '../../../components/common/form/input-component'
import { successNotice, errorNotice } from '../../../utilities/notification'
import dashboardService from "../../../services/service"
import { useNavigate } from 'react-router-dom'

const CategoryCreate = () => {
    const categoryDTO = Yup.object({
        name: Yup.string().min(2).required(),
        parent: Yup.string(),
        brand: Yup.array().optional(),
        status: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }).required(),
        image: Yup.mixed().required()
    })
    const [loading, setLoading] = useState<boolean>()

    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(categoryDTO)
    })
    const navigate = useNavigate();

    const [Option, setOption] = useState()
    const [Brand, setBrand] = useState()

    const parent = async () => {
        try {
            const result: any = await dashboardService.getRequest('/category/parent', { auth: true })
            const parent: any = Object.values(result.parent);
            const brand: any = Object.values(result.brand);

            let opt: any = [];
            parent.map((key: any) => opt.push({
                label: key.name,
                value: key._id
            }));
            let opt1: any = [];
            brand.map((key: any) => opt1.push({
                label: key.name,
                value: key._id
            }));

            setOption(opt)
            setBrand(opt1)
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
        parent()
    }, [loading])

    const resetEvent = () => {
        navigate('/dashboard/category')
    }

    const submitEvent = async (data: any) => {
        setLoading(true)
        let opt: any = [];
        data.brand.map((key: any) => opt.push(
            key.value
        ));
        try {
            data = {
                ...data,
                brand: opt,
                status: data.status.value
            }
            await dashboardService.postRequest('/category', data, { auth: true, file: true })
            successNotice('Category created successfully.')
            navigate('/dashboard/category')
        } catch (exception: any) {
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                errorNotice('Category can not be created at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto lg:py-12">
                <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">Add a new Category</h2>
                <form onSubmit={handleSubmit(submitEvent)} onReset={resetEvent}>
                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor='name'>Name: </InputLabel>
                            <TextInputCapital
                                name='name'
                                control={control}
                                msg={errors?.name?.message}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor='parent'>Parent: </InputLabel>
                            <DropdownComponent
                                name='parent'
                                label='Select Parent'
                                options={Option}
                                control={control}
                                msg={errors?.parent?.message}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor='brand'>Brand:</InputLabel>
                            <SelectComponent
                                options={Brand}
                                control={control}
                                name='brand'
                                defaultValue='[]'
                                multiple={true}
                                msg={errors?.brand?.message}
                            />
                        </div>

                        < div className="sm:col-span-2">
                            <InputLabel htmlFor='status'>Status:</InputLabel>
                            <SelectComponent
                                options={[{ label: 'Published', value: 'active' }, { label: 'Un-Published', value: 'inactive' }]}
                                control={control}
                                name='status'
                                defaultValue='active'
                                msg={errors?.status?.message}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="image">Image: </InputLabel>
                            <SingleImageUpload
                                name='image'
                                msg={errors?.image?.message}
                                setValue={setValue}
                            />
                        </div>
                    </div>
                    <div className='inline-flex items-center gap-5'>
                        <CancelButton loading={loading as boolean} btnText='Cancel' />
                        <SubmitButton loading={loading as boolean} btnText='Add Category' />
                    </div>
                </form>
            </div>
        </section>

    </>)
}
export default CategoryCreate