import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../../Services/UserService";
import "./Payement.css";

const Payment = () => {

    const { placeOrder } = UserService();

    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);


    // =========================================
    // PLACE ORDER
    // =========================================

    const handlePlaceOrder = async () => {

        if (!paymentMethod) {
            alert("Please select a payment method");
            return;
        }

        try {

            setLoading(true);

            console.log(
                "Sending payment method:",
                paymentMethod
            );


            const response = await placeOrder({
                paymentMethod: paymentMethod
            });


            console.log(
                "Place order response:",
                response
            );


            if (response?.success) {

                console.log(
                    "Created orders:",
                    response.orders
                );

                // =====================================
                // SUCCESS
                // =====================================

                navigate("/payment-success", {
                    state: {
                        orders: response.orders
                    }
                });

            } else {

                alert(
                    response?.message ||
                    "Unable to place order"
                );

            }

        } catch (error) {

            console.error(
                "Error placing order:",
                error
            );


            // =========================================
            // SHOW EXACT BACKEND ERROR
            // =========================================

            const backendMessage =
                error?.response?.data?.message;


            const skippedItems =
                error?.response?.data?.skippedItems;


            console.error(
                "Backend message:",
                backendMessage
            );


            console.error(
                "Skipped items:",
                skippedItems
            );


            alert(
                backendMessage ||
                "Something went wrong while placing the order"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="payment_section">

            <h2 className="payment_title">
                Payment Methods
            </h2>


            {/* =================================
                CASH ON DELIVERY
            ================================== */}

            <div
                className={`payment_option ${
                    paymentMethod === "COD"
                        ? "payment_option_active"
                        : ""
                }`}
                onClick={() =>
                    setPaymentMethod("COD")
                }
            >

                <div className="payment_option_left">

                    <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={
                            paymentMethod === "COD"
                        }
                        onChange={() =>
                            setPaymentMethod("COD")
                        }
                    />


                    <div className="payment_text">

                        <h3>
                            Cash on Delivery
                        </h3>

                        <p>
                            Pay when your order is delivered
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================
                ONLINE PAYMENT
            ================================== */}

            <div
                className={`payment_option ${
                    paymentMethod === "Online"
                        ? "payment_option_active"
                        : ""
                }`}
                onClick={() =>
                    setPaymentMethod("Online")
                }
            >

                <div className="payment_option_left">

                    <input
                        type="radio"
                        name="payment"
                        value="Online"
                        checked={
                            paymentMethod === "Online"
                        }
                        onChange={() =>
                            setPaymentMethod("Online")
                        }
                    />


                    <div className="payment_text">

                        <h3>
                            Online Payment
                        </h3>

                        <p>
                            Pay securely using online payment
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================
                PAY NOW
            ================================== */}

            <button
                className="pay_now_button"
                onClick={handlePlaceOrder}
                disabled={loading}
            >

                {loading
                    ? "Placing Order..."
                    : "Pay Now"
                }

            </button>

        </div>

    );
};

export default Payment;