import React from "react";
import { useNavigate } from "react-router-dom";

import Payement_page from "./Payement_page";

import "./PaymentSuccess.css";

const PaymentSuccess = () => {

    const navigate = useNavigate();

    return (
        <div className="payment-success-wrapper">

            {/* =====================================
                ACTUAL PAYMENT PAGE IN BACKGROUND
            ====================================== */}

            <div className="payment-page-background">

                <Payement_page />

            </div>


            {/* =====================================
                DARK + BLUR OVERLAY
            ====================================== */}

            <div className="payment-success-overlay"></div>


            {/* =====================================
                SUCCESS MODAL
            ====================================== */}

            <div className="payment-success-modal">

                {/* SUCCESS ICON */}

                <div className="success-icon">

                    <svg
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >

                        <circle
                            cx="50"
                            cy="50"
                            r="50"
                            fill="#49C96B"
                        />

                        <path
                            d="M27 51L42 66L73 34"
                            fill="none"
                            stroke="white"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                    </svg>

                </div>


                {/* TITLE */}

                <h1>
                    Thank You for Ordering!
                </h1>


                {/* MESSAGE */}

                <p>
                    Your order has been successfully placed.
                    <br />
                    We're preparing it for shipment.
                </p>


                {/* BUTTONS */}

                <div className="success-buttons">

                    <button
                        className="back-home-button"
                        onClick={() => navigate("/")}
                    >
                        Back to Home
                    </button>


                    <button
                        className="track-order-button"
                        onClick={() => navigate("/orders")}
                    >
                        Track Order
                    </button>

                </div>

            </div>

        </div>
    );
};

export default PaymentSuccess;