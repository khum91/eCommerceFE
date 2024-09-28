import axiosInstance from "../../config/axios.config";
import { errorNotice } from "../../utilities/notification";
class ApiService {
    private headers = {};
    private params = {};

    private getHeaders = (config: any) => {
        // auth
        if (config && config.auth) {
            let token = localStorage.getItem('at') || null

            if (!token) {
                errorNotice('Login First')
                document.location.href = '/login';
            }

            this.headers = {
                ...this.headers,
                'Authorization': 'Bearer ' + token
            }

        }
        // content Type
        if (config && (config.file || config.files)) {
            this.headers = {
                ...this.headers,
                "Content-Type": "multipart/form-data"
            }
        }

        //query string
        if (config && config.params) {
            this.params = {
                ...this.params,
                ...config.params
            }

        }
    }

    getRequest = async (url: string) => {
        try {
            const response = await axiosInstance.get(url)
            return response
        } catch (error) {
            console.error('Get Request Error', error)
            throw error
        }
    }

    postRequest = async (url: string, data: any = {}, config: any = null): Promise<any> => {
        try {
            this.getHeaders(config);
            const response = await axiosInstance.post(url, data, {
                headers: { ...this.headers },
                params: { ...this.params }
            })
            return response
        } catch (error) {
            console.error('Post Request Exception: ', error)
            throw error;
        }
    }
}
export default new ApiService()