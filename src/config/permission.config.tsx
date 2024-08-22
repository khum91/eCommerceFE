import { useContext, useEffect, useState } from "react"
import LoadingComponent from "../components/common/loading/loading.component"
import AuthContext from "../context/auth.context"
import { NoPermission } from "../pages/error/no.permission"

const AllowUser = ({ allowuser, children }: { allowuser: string, children: any }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [giveAcess, setAccess] = useState<boolean>()

    const auth: any = useContext(AuthContext)

    useEffect(() => {
        if (auth.loggedInUser) {
            if (allowuser === auth.loggedInUser.role) {
                setAccess(true)
            } else {
                setAccess(false)
            }
            setLoading(false)
        } else {
            setLoading(false)
        }

    }, [auth])

    return (<>
        {
            loading ? <>
                <LoadingComponent />
            </> : <>
                {
                    giveAcess ? <>{children}</> : <><NoPermission /></>
                }

            </>
        }
    </>)

}
export default AllowUser