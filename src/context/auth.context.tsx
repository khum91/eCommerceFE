import { createContext, useEffect, useState } from "react";
import authService from "../pages/auth/auth.service";
import LoadingComponent from "../components/common/loading/loading.component";


let AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: any }) => {

    let [loggedInUser, setLoggedInUser] = useState();
    let [loading, setLoading] = useState<boolean>()
    const getLoggedInUser = async () => {
        setLoading(true)
        try {
            const response: any = await authService.getRequest('/auth/me', { auth: true });
            setLoggedInUser(response.result)
            setLoading(false)

        } catch (error: any) {
            if (+error.status === 401) {
                if (error.data.message === 'jwt expired') {


                }
                localStorage.removeItem('at')
                localStorage.removeItem('rt')

            }

            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('at')
        if (token) {
            getLoggedInUser()
        } else {
            setLoading(false)
        }
    }, [])
    return (
        <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
            {
                loading ? <><LoadingComponent /></>
                    : <>
                        {children}
                    </>
            }
        </AuthContext.Provider>
    )
}

export default AuthContext