import { toast } from "react-toastify";
import axiosInstance from "../config/axios.config";

abstract class HttpService {
    private headers = {};
    private params = {};

    private getHeaders = (config: any) => {
        // auth
        if (config && config.auth) {
            let token = localStorage.getItem('at') || null

            if (!token) {
                toast.error('Login First')
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

    getRequest = async (url: string, config: any = null) => {
        try {
            this.getHeaders(config)
            const response = await axiosInstance.get(url, {
                headers: { ...this.headers },
                params: { ...this.params }
            })
            return response
        } catch (error) {
            console.error('Get Request Error', error)
            throw error
        }
    }

    putRequest = async (url: string, data: any = {}, config: any = null) => {
        try {
            this.getHeaders(config);
            const response = await axiosInstance.put(url, data, {
                headers: { ...this.headers },
                params: { ...this.params }
            })
            return response
        } catch (error) {
            console.error('Put Request Exception: ', error)
            throw error;
        }
    }

    patchRequest = (url: string, data: any = {}, config: any = null) => { }

    deleteRequest = async (url: string, config: any = null) => {
        try {
            this.getHeaders(config)
            const response = await axiosInstance.delete(url, {
                headers: { ...this.headers },
                params: { ...this.params }
            })
            return response
        } catch (error) {
            console.error('Delete Request Error', error)
            throw error

        }

    }
}
export default HttpService