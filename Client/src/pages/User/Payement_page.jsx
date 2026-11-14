import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/user_components/Navbar/Navbar";
import Get_Cart from "../../components/user_components/Get_Cart/Get_Cart";
import Get_Address from "../../components/user_components/Get_Address/Get_Address";
import Payement from "../../components/user_components/Payement/Payement";

import "./Payement_page.css";
import Cart_Summary from "../../components/user_components/Cart_Summary/Cart_Summary";

const Payement_page = () => {

    const navigate = useNavigate();

    const isAuthenticated = Boolean(localStorage.getItem("token"));

    useEffect(() => {

        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);


    if (!isAuthenticated) {
        return null;
    }


return (

        <div className="payment-page">
            <Navbar />

            <main className="payment-container">

                <section className="payment-left">
                    <div className="payment-cart-section">
                        <Get_Cart />
                    </div>

                    <div className="payment-personal-section">
                        <h2 className="payment-section-title">
                            Personal Details
                        </h2>
                        <div className="address-section">
                            <Get_Address />
                        </div>
                    </div>
                </section>

                <section className="payment-right">
                    <div className="payment-summary-section">
                        <Cart_Summary />
                    </div>
                    <div className="payment-method-section">
                        <Payement />
                    </div>
                </section>

            </main>

        </div>
    );
};

export default Payement_page;

