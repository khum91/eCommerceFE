import { useContext, useEffect, useState } from "react";
import HomePageTitle from "../../../components/common/title/home-title.component";
import LoadingComponent from "../../../components/common/loading/loading.component";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../auth.service";
import { Button } from "flowbite-react";
import AuthContext from "../../../context/auth.context";
import { toast } from 'react-toastify';

const ActivationPage = () => {
    const auth: any = useContext(AuthContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    let [msg, setMsg] = useState('')
    let [isExpired, setIsExpired] = useState(false)

    const params = useParams()

    const getVerified = async () => {
        try {
            const token = params.token
            await authService.getRequest('/auth/activate/' + token)
            setMsg('Your account has been activated successfully. Please Login to continue')

        } catch (error: any) {
            if (+error.status === 400 && error.data.result && error.data.result.hasOwnProperty('token') && error.data.result.token === 'expired') {

                setIsExpired(true)
            }
            else {
                setMsg('Your account has been already activated. Please continue with login.')
            }
            console.log('Exception', error);

        } finally {
            setLoading(false)
        }
    }
    const resendToken = async () => {
        try {
            setLoading(true)
            await authService.getRequest('/auth/resend-token/' + params.token)
            setMsg('A new activation link has been sent to your registered email. Please check for the further process')

        } catch (error) {
            setMsg('There was a problem to send reactivation code. Please contact our admin to activate your account')
        } finally {
            setLoading(false)
            setIsExpired(false)
        }
    }

    useEffect(() => {
        getVerified()
    }, [])

    useEffect(() => {
        if (auth.loggedInUser) {
            toast.info('You are already Activated User')
            navigate('/' + auth.loggedInUser.role)
        }
    }, [auth])


    return (<>

        <HomePageTitle title="Activatate your Account" />
        <div className="mx-3 md:mx-20 py-5 gap-2 mt-5 text-center min-h-screen">
            {
                loading ? <><LoadingComponent size='xl' /></> :
                    <>
                        {
                            msg ? msg : <></>
                        }

                        {
                            isExpired ? <>
                                <Button className="w-full bg-teal-700" onClick={resendToken}>
                                    Token has been expired. Please confirm to resend the new token.
                                </Button>

                            </> :

                                <></>
                        }
                    </>
            }

        </div>


    </>)
}
export default ActivationPage;