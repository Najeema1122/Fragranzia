// useAxiosPrivate.jsx
import { useEffect } from "react";
import { axiosPrivate } from "../axios";

const useAxiosPrivate = () => {
    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                const token = localStorage.getItem("token"); // fresh on every request
                if (!config.headers['Authorization'] && token) {
                    config.headers['Authorization'] = token;
                }

                if (config.data instanceof FormData) {
                    config.headers["Content-Type"] = "multipart/form-data";
                } else {
                    config.headers["Content-Type"] = "application/json";
                }

                return config;
            },
            error => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            error => Promise.reject(error)
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, []);

    return axiosPrivate;
};

export default useAxiosPrivate;