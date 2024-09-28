import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import apiService from '../../services/service'
import AuthContext from "../../context/auth.context"
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext, useEffect, useState } from "react"
import { NoPermission } from "../../pages/error/no.permission"
import { errorNotice, successNotice } from '../../utilities/notification'
import { InputLabel } from '../../components/common/form/label-component'
import { CancelButton, ImageUpload, SubmitButton, TextInputComponent } from '../../components/common/form/input-component'

const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z ]+$/, 'Name can contain only alphabets and space').min(2).max(50).required(),
    email: Yup.string().email().required(),
    password: Yup.string().matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/, 'Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.'),
    cpassword: Yup.string().oneOf([Yup.ref('password')]),
    role: Yup.string().nullable().optional(),
    address: Yup.string().nullable().optional(),
    phone: Yup.string().matches(/^([0|\+[0-9]{1,5})?([0-9]{10})$/).min(10).max(15),
    image: Yup.mixed().optional(),
});


const MyProfile = () => {
    const navigate = useNavigate();
    const [giveAcess, setAccess] = useState<boolean>()
    const [loading, setLoading] = useState<boolean>()
    const auth: any = useContext(AuthContext)

    const { control, setValue, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const User = () => {
        if (auth.loggedInUser) {
            setValue('name', auth.loggedInUser.name)
            setValue('email', auth.loggedInUser.email)
            setValue('address', auth.loggedInUser.address)
            setValue('phone', auth.loggedInUser.phone)
            setValue('role', auth.loggedInUser.role)
        }
    }

    useEffect(() => {
        if (auth.loggedInUser) {
            setAccess(true)
            User()
        }
    }, [])


    const resetEvent = () => {
        navigate('/')
    }
    const submitEvent = async (data: any) => {
        setLoading(true)
        try {
            await apiService.putRequest('/user/' + auth.loggedInUser._id, data, { auth: true, file: true })
            successNotice('User edited successfully.')
        } catch (exception: any) {
            if (+exception.status === 422) {
                Object.keys(exception.data.result).map((field: any) => {
                    setError(field, { message: exception.data.result[field] });
                })
            } else {
                errorNotice('User can not be edited at this moment.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {
                giveAcess ? <>
                    <div className=" flex gap-2  my-2 ... ring-2 ring-yellow-100 rounded mx-5 p-5 bg-white">
                        <form onSubmit={handleSubmit(submitEvent)} onReset={resetEvent}
                            className=' w-full flex gap-10'>
                            <div className='w-2/5 flex flex-col gap-3'>
                                <div className="sm:col-span-6">
                                    <InputLabel htmlFor='name'>Name: </InputLabel>
                                    <TextInputComponent
                                        name='name'
                                        control={control}
                                        msg={errors?.name?.message}
                                    />
                                </div>
                                <div className="sm:col-span-6">
                                    <InputLabel htmlFor='email'>Email: </InputLabel>
                                    <TextInputComponent
                                        name='email'
                                        control={control}
                                        msg={errors?.email?.message}
                                        disable={true}
                                    />
                                </div>
                                <div>
                                    <a href="#" className=" hover:text-orange-500 transition-colors duration-300">
                                        Change Password?
                                    </a>
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor='address'>Address: </InputLabel>
                                    <TextInputComponent
                                        name='address'
                                        control={control}
                                        msg={errors?.address?.message}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor='phone'>Phone: </InputLabel>
                                    <TextInputComponent
                                        name='phone'
                                        control={control}
                                        msg={errors?.phone?.message}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <InputLabel htmlFor='role'>Role: </InputLabel>
                                    <TextInputComponent
                                        name='role'
                                        control={control}
                                        msg={errors?.role?.message}
                                        disable={true}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="sm:col-span-2">
                                    <p className=' w-full text-center'>User Image</p>
                                    <ImageUpload
                                        name='image'
                                        msg={errors?.image?.message}
                                        setValue={setValue}
                                        imageUrl={import.meta.env.VITE_IMAGE_URL + '/users/' + auth.loggedInUser.image}
                                    />
                                </div>
                                <div className='inline-flex items-center gap-5'>
                                    <CancelButton loading={loading as boolean} btnText='Cancel' />
                                    <SubmitButton loading={loading as boolean} btnText='Update' />
                                </div>
                            </div>
                        </form>
                    </div>
                </> : <><NoPermission /></>
            }
        </>)
}
export default MyProfile