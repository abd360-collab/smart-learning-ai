import axios from "axios";
import { BASE_URL } from "./apiPaths";


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        // if token exist attach it into the header.
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config; // continue with the request
    },
    (error) => {
        return Promise.reject(error);
    }
);


//response interceptor.
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response) {
            if(error.response.this.status == 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code == "ECONNABORATED") {
            console.error("Request timeout. Please Try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;