import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserService = () => {
    const axiosPrivate = useAxiosPrivate();

    const login = async (credentials) => {
        const response = await axiosPrivate.post("/auth/login", credentials);
        return response.data;
    };

    const getProduct = async () => {
        const response = await axiosPrivate.get("/admin/add_product/shop");
        return response.data;
    };

    const getCart = async () => {
        const response = await axiosPrivate.get("/api/cart");
        return response.data;
    };

    const postCart = async (data) => {
        const response = await axiosPrivate.post("/api/cart/add", data);
        return response.data;
    };

    const postQuantity = async (productId, quantity) => {
        const response = await axiosPrivate.put(
            `/api/cart/quantity/${productId}`,
            { quantity }
        );
        return response.data;
    };

    const deleteCartItem = async (productId) => {
        const response = await axiosPrivate.delete(`/api/cart/${productId}`);
        return response.data;
    };

    const getWishList = async () => {
        const response = await axiosPrivate.get("/api/wish_list");
        return response.data;
    };

    const postWishList = async (data) => {
        const response = await axiosPrivate.post("/api/wish_list", data);
        return response.data;
    };

    const deleteWishList = async (id) => {
        const response = await axiosPrivate.delete(`/api/wish_list/${id}`);
        return response.data;
    };

    const addAddress = async (data) => {
        const response = await axiosPrivate.post("/api/address/add", data);
        return response.data;
    };

    const getAddress = async () => {
        const response = await axiosPrivate.get("/api/address");
        return response.data;
    };

    const setPrimaryAddress = async (id) => {
        const response = await axiosPrivate.put(`/api/address/primary/${id}`);
        return response.data;
    };

    const placeOrder = async (orderData) => {
        const response = await axiosPrivate.post("/api/order/place", orderData);
        return response.data;
    };

    const getOrders = async () => {
        const response = await axiosPrivate.get("/api/order");
        return response.data;
    };

    const cancelOrder = async (orderId) => {
        const response = await axiosPrivate.put(`/api/order/${orderId}/cancel`);
        return response.data;
    };

    const returnOrder = async (orderId) => {
        const response = await axiosPrivate.put(`/api/order/${orderId}/return`);
        return response.data;
    };

    const getProfile = async () => {
        const response = await axiosPrivate.get("/api/profile");
        return response.data;
    };

    const updateProfile = async (data) => {
        const response = await axiosPrivate.put("/api/profile", data);
        return response.data;
    };

    return {
        login,
        getProduct,
        getCart,
        postCart,
        postQuantity,
        deleteCartItem,
        getWishList,
        postWishList,
        deleteWishList,
        addAddress,
        getAddress,
        setPrimaryAddress,
        placeOrder,
        getOrders,
        cancelOrder,
        returnOrder,
        getProfile,
        updateProfile,
    };
};

export default UserService;