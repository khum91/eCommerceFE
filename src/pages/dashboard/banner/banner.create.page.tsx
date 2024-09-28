import * as Yup from 'yup'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import bannerService from './banner.service'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { INPUT_TYPE } from '../../../components/common/form/input-contract'
import { InputLabel } from '../../../components/common/form/label-component'
import { CancelButton, SelectComponent, SingleImageUpload, SubmitButton, TextInputComponent } from '../../../components/common/form/input-component'

const AdminBannerCreate = () => {
    const bannerDTO = Yup.object({
        name: Yup.string().min(2).required(),
        status: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }).required(),
        link: Yup.string().url().required(),
        image: Yup.mixed().required()
    })
    const [loading, setLoading] = useState<boolean>()

    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(bannerDTO)
    })
    const navigate = useNavigate();

    const resetEvent = () => {
        navigate('/dashboard/banner')
    }

    const submitEvent = async (data: any) => {
        setLoading(true)
        try {
            data = {
                ...data,
                status: data.status.value
            }
            await bannerService.postRequest('/banner', data, { auth: true, file: true })
            toast.success('Banner created successfully.')
            navigate('/dashboard/banner')
        } catch (exception: any) {
            console.log(exception);
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                toast.error('Banner can not be created at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>

        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto lg:py-12">
                <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">Add a new Banner</h2>
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
                            />
                        </div>
                    </div>

                    <div className='inline-flex items-center gap-5'>
                        <CancelButton loading={loading as boolean} btnText='Cancel' />
                        <SubmitButton loading={loading as boolean} btnText='Add Banner' />
                    </div>

                </form>
            </div>
        </section>

    </>)
}
export default AdminBannerCreate