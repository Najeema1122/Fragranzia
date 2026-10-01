import React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AdminService = () => {

    const axiosPrivate = useAxiosPrivate()

    const getProduct = async () => {
        const response = await axiosPrivate.get("/admin/add_product");
        return response.data;
    };


    const postProduct = async (data) => {
        const response = await axiosPrivate.post("/admin/add_product", data);
        return response.data;
    };

    const updateProduct = async (id, data) => {
        const response = await axiosPrivate.put(`/admin/add_product/${id}`, data);
        return response.data;
    };

    const blockProduct = async (id) => {
        const response = await axiosPrivate.put(`/admin/add_product/${id}/block`);
        return response.data;
    };

    //------------------categories-----------------
    const getCategories = async () => {
        const response = await axiosPrivate.get("/admin/add_category");
        return response.data;
    };
    const addCategories = async (data) => {
        const response = await axiosPrivate.post("/admin/add_category", data)
        return response.data;
    }

    const putCategory = async (id, data) => {
        const response = await axiosPrivate.put(`/admin/add_category/${id}`, data) 
        return response.data;
    }

    //------------------users-----------------
    const getUsers = async () => {
        const response = await axiosPrivate.get("/api/profile/admin/users");
        return response.data;
    };

    const toggleBlockUser = async (id) => {
        const response = await axiosPrivate.put(`/api/profile/admin/users/${id}/block`);
        return response.data;
    };

    //------------------orders-----------------
    const getOrders = async () => {
        const response = await axiosPrivate.get("/api/order/admin/all");
        return response.data;
    };

    const updateOrderStatus = async (id, status) => {
        const response = await axiosPrivate.put(`/api/order/admin/${id}/status`, { status });
        return response.data;
    };

    //------------------dashboard-----------------
    const getDashboardStats = async () => {
        const response = await axiosPrivate.get("/api/order/admin/stats");
        return response.data;
    };


    return {
        postProduct,
        getProduct,
        updateProduct,
        blockProduct,
        getCategories,
        addCategories,
        putCategory,
        getUsers,
        toggleBlockUser,
        getOrders,
        updateOrderStatus,
        getDashboardStats
    }


};

export default AdminService