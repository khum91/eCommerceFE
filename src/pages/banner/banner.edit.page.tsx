import { yupResolver } from '@hookform/resolvers/yup'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { InputLabel } from '../../components/common/form/label-component'
import { SelectComponent, SingleImageUpload, SubmitButton, CancelButton, TextInputComponent } from '../../components/common/form/input-component'
import { INPUT_TYPE } from '../../components/common/form/input-contract'
import { toast } from 'react-toastify'
import bannerService from './banner.service'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingComponent from '../../components/common/loading/loading.component'

const AdminBannerEdit = () => {
    const bannerDTO = Yup.object({
        name: Yup.string().min(2).required(),
        status: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }).required(),
        link: Yup.string().url().required(),
        image: Yup.mixed().required()
    })
    const [loading, setLoading] = useState<boolean>(true)

    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(bannerDTO)
    })
    const navigate = useNavigate();
    const params = useParams();
    const [detail, setDetail] = useState<any>()

    const getBannerDetail = useCallback(async () => {
        try {
            const response: any = await bannerService.getRequest('/banner/' + params.id, { auth: true })
            let bannerDetail = {
                ...response.result,
                image: import.meta.env.VITE_IMAGE_URL + '/banners/' + response.result.image
            }
            setDetail(bannerDetail);
            setValue('name', response.result.name)
            setValue('link', response.result.link)
            setValue('status', {
                label: response.result.status === 'active' ? "Published" : "Un-Published",
                value: response.result.status
            })
            setValue('image', response.result.image)
            setLoading(false)
        } catch (exception) {
            toast.error('Banner can not be fetched.')
            navigate('/admin/banner')
        }

    }, [params])

    useEffect(() => {
        getBannerDetail();
    }, [params])

    const resetEvent = () => {
        navigate('/admin/banner')
    }

    const submitEvent = async (data: any) => {
        setLoading(true)
        try {
            data = {
                ...data,
                status: data.status.value
            }
            if (typeof data.image !== 'object') {
                delete data.image
            }
            await bannerService.putRequest('/banner/' + params.id, data, { auth: true, file: true })
            toast.success('Banner edited successfully.')
            navigate('/admin/banner')
        } catch (exception: any) {
            console.log(exception);
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                toast.error('Banner can not be edited at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>

        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto lg:py-12">
                <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">Edit Banner</h2>
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
                                    <InputLabel htmlFor='url'>Link:</InputLabel>
                                    <TextInputComponent
                                        name='link'
                                        type={INPUT_TYPE.URL}
                                        control={control}
                                        msg={errors?.link?.message}
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
                                <SubmitButton loading={loading as boolean} btnText='Edit Banner' />
                            </div>

                        </form>
                    </>
                }
            </div>
        </section>

    </>)
}
export default AdminBannerEdit