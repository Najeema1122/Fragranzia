import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/User/Home";
import Productpage from "./pages/User/Productpage";
import Sign_up from "./pages/User/Sign_up";
import Admin from "./pages/Admin/Admin";
import ProductAdmin from "./components/Admin_components/Admin_product/ProductAdmin";
import CategoryAdmin from "./components/Admin_components/Admin_category/CategoryAdmin";
import Det_product_page from "./pages/User/Det_product_page";
import About_page from "./pages/User/About_page";
import Cart_page from "./pages/User/Cart_page";
import Log_in from "./pages/User/Log_in";
import UserService from "./Services/UserService";
import Profile_page from "./pages/User/Profile_page";
import Payement_page from "./pages/User/Payement_page";
import PaymentSuccess from "./pages/User/PaymentSuccess";
import Wish_List_Page from "./pages/User/Wish_List_page";
import OrderAdmin from "./components/Admin_components/Admin_order/OrderAdmin";
import UserAdmin from "./components/Admin_components/Admin_users/UserAdmin";
import Dashboard from "./components/Admin_components/Admin_dashBoard/Dashboard";
import AdminRoute from "./routes/AdminRoute";

const App = () => {
    const [data, setData] = useState([]);

    const { getProduct } = UserService();

    const fetchProduct = async () => {
        try {
            const res = await getProduct();

            console.log("product list", res);

            setData(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <Routes>

            {/* ================= USER ROUTES ================= */}

            {/* Anyone can enter */}
            <Route
                path="/"
                element={<Home products={data} />}
            />

            {/* Anyone can view products */}
            <Route
                path="/products"
                element={<Productpage products={data} />}
            />

            {/* Anyone can view product details */}
            <Route
                path="/product/:id"
                element={<Det_product_page products={data} />}
            />

            <Route
                path="/about"
                element={<About_page />}
            />

            {/* Cart page can exist, but API itself is protected */}
            <Route
                path="/cart"
                element={<Cart_page />}
            />

            <Route
                path="/signup"
                element={<Sign_up />}
            />

            <Route
                path="/login"
                element={<Log_in />}
            />

            <Route
                path="/profile"
                element={<Profile_page />}
            />

            <Route
                path="/payment"
                element={<Payement_page />}
            />

            <Route
                path="/payment-success"
                element={<PaymentSuccess />}
            />

            <Route
                path="/wishlist"
                element={<Wish_List_Page />}
            />




            {/* ================= ADMIN ROUTES ================= */}

            <Route element={<AdminRoute />}>

                <Route path="/admin" element={<Admin />}>

                    <Route
                        index
                        element={<Dashboard />}
                    />

                    <Route
                        path="dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="add_product"
                        element={<ProductAdmin />}
                    />

                    <Route
                        path="add_category"
                        element={<CategoryAdmin />}
                    />

                    <Route
                        path="orders"
                        element={<OrderAdmin />}
                    />

                    <Route
                        path="users"
                        element={<UserAdmin />}
                    />

                </Route>

            </Route>

        </Routes>
    );
};

export default App;