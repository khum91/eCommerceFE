import dashboardService from "../../../services/service"
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { BaseSyntheticEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputLabel } from '../../../components/common/form/label-component'
import {
    SubmitButton, CancelButton, RoleSelector, TextInputComponent, TextAreaInputComponent
} from '../../../components/common/form/input-component'
import { successNotice, errorNotice } from '../../../utilities/notification'
import { INPUT_TYPE } from "../../../components/common/form/input-contract";
import authService from '../../auth/auth.service'

const UserCreate = () => {
    const navigate = useNavigate();
    const userDTO = authService.registerUserDto();
    const [loading, setLoading] = useState<boolean>()

    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(userDTO)
    })

    const resetEvent = () => {
        navigate('/dashboard/user')
    }

    const submitEvent = async (data: any) => {
        setLoading(true);
        try {
            const response = await dashboardService.postRequest('/user', data, { auth: true, file: true });
            successNotice(response.message+"Activation link has been sent to email.")
            navigate('/dashboard/user')
        } catch (error: any) {
            if (+error.status === 422) {
                Object.keys(error.data.result).map((field: any) => {
                    setError(field, { message: error.data.result[field] });
                })
            } else {
                errorNotice(error.data.message)
            }
        } finally {
            setLoading(false)
        }
    }
    return (<>
        <div className="w-full min-h-screen bg-white p-5">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white text-center">Add a New User</h2>
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

                        <div className="col-span-6 sm:col-span-3">
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <TextInputComponent name="password" type={INPUT_TYPE.PASSWORD}
                                control={control}
                                msg={errors?.password?.message} />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <InputLabel htmlFor="confirmPassword">Password Confirmation</InputLabel>
                            <TextInputComponent name="confirmPassword" type={INPUT_TYPE.PASSWORD}
                                control={control}
                                msg={errors?.confirmPassword?.message} />
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
                            <RoleSelector
                                control={control}
                                name="role"
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
                    <SubmitButton loading={loading as boolean} btnText='Add User' />
                </div>
            </form >
        </div>
    </>)
}
export default UserCreate