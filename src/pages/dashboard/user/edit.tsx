import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import dashboardService from "../../../services/service"
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { InputLabel } from '../../../components/common/form/label-component'
import { successNotice, errorNotice } from '../../../utilities/notification'
import { INPUT_TYPE } from "../../../components/common/form/input-contract";
import { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react'
import LoadingComponent from '../../../components/common/loading/loading.component'
import {
    SubmitButton, CancelButton, SelectComponent, TextInputComponent, TextAreaInputComponent
} from '../../../components/common/form/input-component'

const UserEdit = () => {

    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>()
    const [detail, setDetail] = useState<any>()


    const updateUserDto = Yup.object({
        name: Yup.string().matches(/^[a-zA-Z ]+$/, 'Name can contain only alphabets and space').min(2).max(50).required(),
        email: Yup.string().email().required(),
        address: Yup.string().nullable().optional(),
        phone: Yup.string().matches(/^([0|\+[0-9]{1,5})?([0-9]{10})$/).min(10).max(15),
        image: Yup.mixed().optional(),
        role: Yup.object({ label: Yup.string().required(), value: Yup.string().required() }).required(),
    });
    const roles: object = [{ label: 'Admin', value: 'dashboard' },
    { label: 'Buyer', value: 'customer' },
    { label: 'Seller', value: 'seller' }]

    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(updateUserDto)
    })

    const resetEvent = () => {
        navigate('/dashboard/user')
    }

    const getUserDetail = useCallback(async () => {
        try {
            const response: any = await dashboardService.getRequest('/user/' + params.id, { auth: true })
            let userDetail = {
                ...response.result,
                image: import.meta.env.VITE_IMAGE_URL + '/users/' + response.result.image
            }
            setDetail(userDetail);
            setValue('name', response.result.name)
            setValue('email', response.result.email)
            setValue('phone', response.result.phone)
            setValue('role', {
                label: response.result.role === 'customer' ? "Buyer" : response.result.role,
                value: response.result.role
            })

        } catch (exception) {
            errorNotice('User can not be fetched.')
            navigate('/dashboard/user')
        }
    }, [params])

    useEffect(() => {
        getUserDetail();
    }, [params])

    const submitEvent = async (data: any) => {
        setLoading(true)
        try {
            data = {
                ...data,
                role: data.role.value
            }
            if (typeof data.image !== 'object') {
                delete data.image
            }
            console.log()
            await dashboardService.putRequest('/user/' + params.id, data, { auth: true, file: true })
            successNotice('User edited successfully.')
            navigate('/dashboard/user')
        } catch (exception: any) {
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                console.log(exception)
                errorNotice('User can not be edited at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>
        <div className="w-full min-h-screen bg-white p-5">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white text-center">Edit User</h2>
            {
                loading ? <>
                    <LoadingComponent />
                </> : <>
                    <form onSubmit={handleSubmit(submitEvent)} onReset={resetEvent} className='bg-slate-200 grid gap-4 my-5 p-5 ... ring-2 ring-green-300 rounded'>
                        <div className='w-full inline-flex items-center gap-8'>
                            <div className="mb-2 w-full  flex flex-col gap-5">
                                <div className="col-span-6">
                                    <InputLabel htmlFor="name">Name</InputLabel>
                                    <TextInputComponent name="name"
                                        control={control}
                                        msg={errors?.name?.message}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <TextInputComponent name="email" type={INPUT_TYPE.EMAIL}
                                        control={control}
                                        msg={errors?.email?.message} />
                                </div>
                                <div className="col-span-6">
                                    <InputLabel htmlFor="address">Address</InputLabel>
                                    <TextAreaInputComponent
                                        name="address"
                                        control={control}
                                        msg={errors?.address?.message} />
                                </div>
                                <div className="col-span-6">
                                    <InputLabel htmlFor="phone">Phone</InputLabel>
                                    <TextInputComponent name="phone" type={INPUT_TYPE.TEL}
                                        control={control}
                                        msg={errors?.phone?.message} />
                                </div>

                                <div className="col-span-6">
                                    <InputLabel htmlFor="role">Role</InputLabel>
                                    <SelectComponent
                                        options={roles}
                                        control={control}
                                        name='role'
                                        msg={errors?.role?.message}
                                    />
                                </div>
                                <div className="col-span-6">
                                    <InputLabel htmlFor="image">Image</InputLabel>
                                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(e: BaseSyntheticEvent) => {
                                            e.preventDefault();
                                            const name = e.target.name;
                                            const image = e.target.files[0];
                                            setValue(name, image);
                                        }}
                                    />
                                    <span className="text-sm italic text-red-700">{errors?.image?.message}</span>
                                </div>
                            </div>
                        </div>
                        <div className=" flex gap-4 justify-center">
                            <CancelButton loading={loading as boolean} btnText='Cancel' />
                            <SubmitButton loading={loading as boolean} btnText='Edit User' />
                        </div>
                    </form >
                </>
            }
        </div>
    </>)
}
export default UserEdit