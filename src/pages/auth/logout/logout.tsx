import Swal from "sweetalert2";
import { toast } from "react-toastify";
import authService from "../auth.service";

const logOut = async () => {
    try {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Log Out Now!"
        })
        if (result.isConfirmed) {
            try {
                await authService.deleteRequest('/auth/logout/', { auth: true },)
                localStorage.removeItem('at');
                localStorage.removeItem('rt')
                Swal.fire({
                    title: "Logged Out!",
                    text: "You have been disconnetced",
                    icon: "success"
                });
                toast.success('Log out successfully.')

            } catch (exception) {
                console.log(exception)
                toast.error('Can not be logged out.')
            }

        }
    } catch (error) {

    }
}
export default logOut;