import axios from "axios";

export default function useAxios() {

    const url =  "http://localhost:5041/api/";

    const axiosConfig = axios;


    if (typeof window !== 'undefined') {

        try {


            const token = localStorage.getItem("token");

            if (token) {


                axiosConfig.defaults.headers['Authorization'] = `Bearer ${token}`;

            }

            axiosConfig.defaults.baseURL = url;


        } catch (e) {
            console.log('Axios Error:', e);
        }
    }

    return axiosConfig;
}