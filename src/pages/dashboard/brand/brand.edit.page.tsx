import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { InputLabel } from '../../../components/common/form/label-component'
import { SelectComponent, SingleImageUpload, SubmitButton, CancelButton, TextInputComponent } from '../../../components/common/form/input-component'
import { toast } from 'react-toastify'
import brandService from './brand.service'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingComponent from '../../../components/common/loading/loading.component'
import { ToggleSwitch } from 'flowbite-react'
import { errorNotice } from '../../../utilities/notification'

const AdminBrandEdit = () => {
    const brandDTO = Yup.object({
        name: Yup.string().min(2).required(),
        status: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }).required(),
        isFeatured: Yup.boolean().default(false),
        image: Yup.mixed().required()
    })
    const [loading, setLoading] = useState<boolean>(true)
    const [featured, setFeatured] = useState<boolean>(false);

    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(brandDTO)
    })
    const navigate = useNavigate();
    const params = useParams();
    const [detail, setDetail] = useState<any>()

    const getBrandDetail = useCallback(async () => {
        try {
            const response: any = await brandService.getRequest('/brand/' + params.id, { auth: true })
            if (response.result == 'notallowed') {
                errorNotice('You cannot modify entities created by others', 3000)
                navigate('/dashboard/brand')
                return
            }
            let brandDetail = {
                ...response.result,
                image: import.meta.env.VITE_IMAGE_URL + '/brands/' + response.result.image
            }
            setDetail(brandDetail);
            setValue('name', response.result.name)
            setValue('isFeatured', response.result.isFeatured)
            setFeatured(response.result.isFeatured)

            setValue('status', {
                label: response.result.status === 'active' ? "Published" : "Un-Published",
                value: response.result.status
            })
            setValue('image', response.result.image)
            setLoading(false)
        } catch (exception: any) {
            navigate('/dashboard/brand')
            if (+exception.status === 513) {
                errorNotice('You cannot modify entities created by others', 3000)
            } else {
                errorNotice('Category can not be created at this moment.')
            }
        }

    }, [params])

    useEffect(() => {
        getBrandDetail();
    }, [params])

    const resetEvent = () => {
        navigate('/dashboard/brand')
    }

    const submitEvent = async (data: any) => {
        setLoading(true)
        try {
            data = {
                ...data,
                status: data.status.value,
                isFeatured: featured
            }
            if (typeof data.image !== 'object') {
                delete data.image
            }
            await brandService.putRequest('/brand/' + params.id, data, { auth: true, file: true })
            toast.success('Brand edited successfully.')
            navigate('/dashboard/brand')
        } catch (exception: any) {
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                toast.error('Brand can not be edited at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>

        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto lg:py-12">
                <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">Edit Brand</h2>
                {
                    loading ? <>
                        <LoadingComponent />
                    </> : <>
                        <form onSubmit={handleSubmit(submitEvent)} onReset={resetEvent}>
                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor='name'>Name: </InputLabel>
                                    <TextInputComponent
                                        name='name'
                                        control={control}
                                        msg={errors?.name?.message}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor='feature'>Featured:</InputLabel>
                                    <ToggleSwitch checked={featured} label='' onChange={setFeatured}
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
                                <SubmitButton loading={loading as boolean} btnText='Edit Brand' />
                            </div>

                        </form>
                    </>
                }
            </div>
        </section>

    </>)
}
export default AdminBrandEdit