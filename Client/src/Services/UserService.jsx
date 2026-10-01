import React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserService = () => {
    console.log("UserService called");

    const axiosPrivate = useAxiosPrivate();

    // ========================================
    // PRODUCT MANAGEMENT
    // ========================================

    const getProduct = async () => {
        const response = await axiosPrivate.get(
            "/admin/add_product/shop"
        );

        return response.data;
    };


    // ========================================
    // CART
    // ========================================

    // Get cart
    const getCart = async () => {
        const response = await axiosPrivate.get(
            "/api/cart"
        );

        return response.data;
    };


    // Add product to cart
    const postCart = async (data) => {
        const response = await axiosPrivate.post(
            "/api/cart/add",
            data
        );

        return response.data;
    };


    // Update cart quantity
    const postQuantity = async (
        productId,
        quantity
    ) => {
        const response = await axiosPrivate.put(
            `/api/cart/quantity/${productId}`,
            {
                quantity,
            }
        );

        return response.data;
    };


    // Delete product from cart
    const deleteCartItem = async (productId) => {
        try {
            const response = await axiosPrivate.delete(
                `/api/cart/${productId}`
            );

            return response.data;

        } catch (error) {
            console.error(
                "Delete cart item error:",
                error
            );

            throw error;
        }
    };


    // ========================================
    // WISHLIST
    // ========================================

    const getWishList = async () => {
        const response = await axiosPrivate.get(
            "/api/wish_list"
        );

        return response.data;
    };


    const postWishList = async (data) => {
        const response = await axiosPrivate.post(
            "/api/wish_list",
            data
        );

        return response.data;
    };


    const deleteWishList = async (data) => {
        const response = await axiosPrivate.delete(
            `/api/wish_list/${data}`
        );

        return response.data;
    };


    
    // ========================================
    // ADDRESS
    // ========================================

    const addAddress = async (data) => {
        const response = await axiosPrivate.post(
            "/api/address/add",
            data
        );

        return response.data;
    };


    const getAddress = async () => {
        const response = await axiosPrivate.get(
            "/api/address"
        );

        return response.data;
    };


    const setPrimaryAddress = async (id) => {
        console.log("setPrimary Address is called");

        const response = await axiosPrivate.put(
            `/api/address/primary/${id}`
        );

        return response.data;
    };


    // ========================================
    // ORDER
    // ========================================

    const placeOrder = async (orderData) => {
        try {
            const response = await axiosPrivate.post(
                "/api/order/place",
                orderData
            );

            return response.data;

        } catch (error) {
            console.error(
                "Place order error:",
                error
            );

            throw error;
        }
    };


    const getOrders = async () => {
        try {
            const response = await axiosPrivate.get(
                "/api/order"
            );

            return response.data;

        } catch (error) {
            console.error(
                "Get orders error:",
                error
            );

            throw error;
        }
    };


    // Cancel an order (customer-initiated)
    const cancelOrder = async (orderId) => {
        try {
            const response = await axiosPrivate.put(
                `/api/order/${orderId}/cancel`
            );

            return response.data;

        } catch (error) {
            console.error(
                "Cancel order error:",
                error
            );

            throw error;
        }
    };

    // Return an order (customer-initiated)
const returnOrder = async (orderId) => {
    try {
        const response = await axiosPrivate.put(
            `/api/order/${orderId}/return`
        );

        return response.data;

    } catch (error) {
        console.error(
            "Return order error:",
            error
        );

        throw error;
    }
};


    // ========================================
    // PROFILE
    // ========================================

    const getProfile = async () => {
        const response = await axiosPrivate.get(
            "/api/profile"
        );

        return response.data;
    };


    const updateProfile = async (data) => {
        try {
            const response = await axiosPrivate.put(
                "/api/profile",
                data
            );

            return response.data;

        } catch (error) {
            console.error(
                "Update profile error:",
                error
            );

            throw error;
        }
    };


    // ========================================
    // RETURN
    // ========================================

    return {
        // Product
        getProduct,

        // Cart
        getCart,
        postCart,
        postQuantity,
        deleteCartItem,

        // Wishlist
        getWishList,
        postWishList,
        deleteWishList,

        // Address
        addAddress,
        getAddress,
        setPrimaryAddress,

        // Order
        placeOrder,
        getOrders,
        cancelOrder,
        returnOrder,

        // Profile
        getProfile,
        updateProfile
    };
};

export default UserService;