import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import *as Yup from 'yup'
import { TextInputComponent } from '../../../components/common/form/input-component'
import { INPUT_TYPE } from '../../../components/common/form/input-contract'
import authService from '../auth.service'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import AuthContext from '../../../context/auth.context'
import { useDispatch } from 'react-redux'
import { setLoggedInUser } from '../../../reducer/auth.reducer'
import { useLoginMutation } from '../auth.api'
const LoginPageComponent = () => {
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const auth: any = useContext(AuthContext)

    const dispatch = useDispatch();

    const LoginDTO = Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required()
    })

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(LoginDTO)
    })
    const LoginAction = async (data: any) => {
        try {
            const response = await login(data).unwrap();
            // const response = await authService.postRequest('/auth/login', data)
            localStorage.setItem('at', response.result.token.access)
            localStorage.setItem('rt', response.result.token.refresh)

            auth.setLoggedInUser(response.result.userDetail)
            // // navigate('/' + response.result.userDetail.role)

           
            navigate('/' + response.result.userDetail.role)
            //  dispatch(setLoggedInUser(response.result.userDetail))
            toast.success('Welcome to ' + response.result.userDetail.role + 'Panel')


        } catch (error: any) {
            console.log(error)
            toast.error('Error while login your account')
        }
    }

    useEffect(() => {
        if (auth.loggedInUser) {
            toast.info('You are already LoggedIn')
            navigate('/' + auth.loggedInUser.role)
        }
    }, [auth])

    return (<>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(LoginAction)}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <TextInputComponent
                                control={control}
                                name='email'
                                type={INPUT_TYPE.EMAIL}
                                msg={errors?.email?.message}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <TextInputComponent
                                control={control}
                                name='password'
                                type={INPUT_TYPE.PASSWORD}
                                msg={errors?.password?.message}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                        </div>
                        <button type="submit"
                            className="inline-block w-full shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                        >Sign In</button>

                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>

    </>)

}
export default LoginPageComponent