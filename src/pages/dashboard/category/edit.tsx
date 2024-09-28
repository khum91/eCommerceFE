import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import dashboardService from "../../../services/service"
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import LoadingComponent from '../../../components/common/loading/loading.component'
import { InputLabel } from '../../../components/common/form/label-component'
import { SelectComponent, SingleImageUpload, SubmitButton, CancelButton, TextInputCapital }
    from '../../../components/common/form/input-component'
import { successNotice, errorNotice } from '../../../utilities/notification'

const CategoryEdit = () => {
    const [Parent, setParent] = useState()
    const [Brand, setBrand] = useState()
    const [detail, setDetail] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)


    const categoryDTO = Yup.object({
        name: Yup.string().min(2).required(),
        parent: Yup.mixed().optional(),
        brand: Yup.array().optional(),
        status: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }).required(),
        image: Yup.mixed().required()
    })

    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(categoryDTO)
    })
    const navigate = useNavigate();
    const params = useParams();

    const getCategoryDetail = useCallback(async () => {
        try {
            const response: any = await dashboardService.getRequest('/category/' + params.id, { auth: true })
            if (response.result == 'notallowed') {
                errorNotice('You cannot modify entities created by others', 3000)
                navigate('/dashboard/category')
                return
            }
            const options: any = await dashboardService.getRequest('/category/parent', { auth: true })
            let categoryDetail = {
                ...response.result,
                image: import.meta.env.VITE_IMAGE_URL + '/categories/' + response.result.image
            }
            setDetail(categoryDetail);
            setValue('name', response.result.name)

            //brand
            setValue('brand', [])
            if (response.result.brand) {
                const br: any = Object.values(response.result.brand);
                let brand: any = [];
                br.map((key: any) => brand.push({
                    label: key.name,
                    value: key._id
                }));
                setValue('brand', brand)
            }
            const brandoptions: any = Object.values(options.brand);
            let opt: any = [];
            brandoptions.map((key: any) => opt.push({
                label: key.name,
                value: key._id
            }));
            setBrand(opt)

            //parent
            setValue('parent', [])
            if (response.result.parent) {
                setValue('parent', [{ label: response.result.parent.name, value: response.result.parent._id }])
            }

            const parentoptions: any = Object.values(options.parent);
            let opt1: any = [];
            parentoptions.map((key: any) => {
                if (key.name !== response.result.name)
                    opt1.push({ label: key.name, value: key._id })
            });
            setParent(opt1)

            setValue('status', {
                label: response.result.status === 'active' ? "Published" : "Un-Published",
                value: response.result.status
            })
            setValue('image', response.result.image)
            setLoading(false)
        } catch (exception) {
            errorNotice('Category can not be fetched.')
            navigate('/dashboard/category')
        }

    }, [params])

    useEffect(() => {
        getCategoryDetail();
    }, [params])

    const resetEvent = () => {
        navigate('/dashboard/category')
    }

    const submitEvent = async (data: any) => {
        setLoading(true)
        let b: any = [];
        data.brand.map((key: any) => b.push(
            key.value
        ));
        try {
            data = {
                ...data,
                brand: b,
                parent: data.parent.value,
                status: data.status.value
            }
            if (typeof data.image !== 'object') {
                delete data.image
            }
            await dashboardService.putRequest('/category/' + params.id, data, { auth: true, file: true })
            successNotice('Category edited successfully.')
            navigate('/dashboard/category')
        } catch (exception: any) {
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                errorNotice('Category can not be edited at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>

        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto lg:py-12">
                <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">Edit Category</h2>
                {
                    loading ? <>
                        <LoadingComponent />
                    </> : <>
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
                                    <SelectComponent
                                        options={Parent}
                                        control={control}
                                        name='parent'
                                        defaultValue=''
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
                                        imageUrl={detail && detail.image}
                                    />
                                </div>
                            </div>

                            <div className='inline-flex items-center gap-5'>
                                <CancelButton loading={loading as boolean} btnText='Cancel' />
                                <SubmitButton loading={loading as boolean} btnText='Edit Category' />
                            </div>
                        </form>
                    </>
                }
            </div>
        </section>

    </>)
}
export default CategoryEdit