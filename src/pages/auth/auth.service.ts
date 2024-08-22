import HttpService from "../../services/http.service";
import * as Yup from 'yup'
class AuthService extends HttpService {
    registerUserDto = () => {
        const registrationDTO = Yup.object({
            name: Yup.string().matches(/^[a-zA-Z ]+$/, 'Name can contain only alphabets and space').min(2).max(50).required(),
            email: Yup.string().email().required(),
            password: Yup.string().matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/, 'Password must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long.').min(8).required(),
            confirmPassword: Yup.string().oneOf([Yup.ref('password')]).required(),
            address: Yup.string().nullable().optional(),
            phone: Yup.string().matches(/^([0|\+[0-9]{1,5})?([0-9]{10})$/).min(10).max(15),
            image: Yup.mixed().optional(),
            role: Yup.string().matches(/^(admin|seller|customer)$/, 'Role can be admin or seller or customer').optional()
        });
        return registrationDTO;
    }


}
const authService = new AuthService();
export default authService;