import axios from "axios";
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 50000,
    timeoutErrorMessage: 'Server timed out.',
    headers: {
        "Content-Type": "application/json"
    }
});
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (exception) => {
        throw exception.response
    })

export default axiosInstance