import Swal from "sweetalert2";
import { errorNotice, successNotice } from "../../../utilities/notification";
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
                successNotice('Log out successfully.')
                window.location.reload();
            } catch (exception) {
                errorNotice('Can not be logged out.')
            }
        }
    } catch (error) {
    }
}
export default logOut;