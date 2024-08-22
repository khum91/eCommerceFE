import { NavLink, useNavigate } from "react-router-dom";
import { BaseSyntheticEvent, useState, useEffect, useContext } from 'react';
import { RoleSelector, TextAreaInputComponent, TextInputComponent } from "../../../components/common/form/input-component";
import { INPUT_TYPE } from "../../../components/common/form/input-contract";
import { InputLabel } from "../../../components/common/form/label-component";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import authService from "../auth.service";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { GoogleLogin } from "@react-oauth/google";
import AuthContext from "../../../context/auth.context";

export function RegisterUser() {

    const auth: any = useContext(AuthContext)

    const registrationDTO = authService.registerUserDto();
    const [loading, setLoading] = useState(false);
    const [hide, setHide] = useState('visible')
    const [formHide, setFormHide] = useState('hidden')

    const navigate = useNavigate()

    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({
        resolver: yupResolver(registrationDTO)
    });

    const clickHandler = (e: React.MouseEvent) => {
        e.preventDefault;
        setHide('hidden')
        setFormHide('visible')
    }
    const submitEvent = async (data: any) => {
        setLoading(true);
        try {
            const response = await authService.postRequest('/auth/register/', data, { file: true });
            toast.success(response.message)
            navigate('/')
        } catch (error: any) {
            console.log(error);
            if (+error.status === 422) {
                Object.keys(error.data.result).map((field: any) => {
                    setError(field, { message: error.data.result[field] });
                })
            } else {
                toast.error(error.data.message);
            }
        } finally {
            setLoading(false)
        }

    }
    useEffect(() => {
        if (auth.loggedInUser) {
            toast.info('You are already Registered')
            navigate('/' + auth.loggedInUser.role)
        }
    }, [auth])


    return (

        <div className=" overflow-x-auto flex flex-col items-center justify-center p-5 m-8 sm:m-2 bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">

            <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome !
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
                "Shop smarter, sign up easier!"
            </p>
            <div className="grid grid-rows-2 items-center justify-center">
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        console.log(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
                <Button className="bg-cyan-800 text-white m-3">Facebook</Button>
                <h1 className="flex flex-col items-center justify-center">
                    OR
                </h1>

                <Button onClick={clickHandler} className={`bg-cyan-800 text-white m-3 ${hide}`}>
                    Register With Your Mail
                </Button>
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?
                    <a href="/login" className="text-gray-700 underline">Log in</a>.
                </p>
                <form onSubmit={handleSubmit(submitEvent)} className={` ${formHide} grid gap-4 my-5`}>
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

                    <div className="col-span-6">
                        <label htmlFor="MarketingAccept" className="flex gap-4">
                            <input
                                type="checkbox"
                                id="MarketingAccept"
                                name="marketing_accept"
                                className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                            />
                            <span className="text-sm text-gray-700">
                                I want to receive emails about events, product updates and company announcements.
                            </span>
                        </label>
                    </div>

                    <div className="col-span-6">
                        <p className="text-sm text-gray-500">
                            By creating an account, you agree to our
                            <NavLink to="/terms-and-condition" className="text-gray-700 underline">terms and conditions </NavLink>
                            and
                            <NavLink to="/privacy-policy" className="text-gray-700 underline">privacy policy</NavLink>.
                        </p>
                    </div>

                    <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                        <button type="submit" disabled={loading}
                            className="inline-block disabled:cursor-not-allowed shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                        >
                            Create an account
                        </button>
                    </div>
                </form>

            </div>

        </div>

    );
}