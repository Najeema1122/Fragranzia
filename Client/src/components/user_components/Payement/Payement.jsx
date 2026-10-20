import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserService from "../../../Services/UserService";
import "./Payement.css";
import Swal from "sweetalert2";
// Vite env variables (must start with VITE_ and live in .env at project root)
 const API_URL = "http://localhost:5000";
// const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const Payment = () => {
    const { placeOrder } = UserService();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);

    // =========================================
    // RAZORPAY CHECKOUT
    // =========================================
    const handlePayment = async (razorpayOrder) => {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            // alert("Failed to load Razorpay SDK. Please check your internet connection.");
            Swal.fire({
                            title:"Payment",
                            text:"Failed to load Razorpay SDK,Please check your internet connection",
                            icon:"error",
                            confirmButtonText:"OK"
                        });
            setLoading(false);
            return;
        }

        // if (!RAZORPAY_KEY) {
        //     console.error("VITE_RAZORPAY_KEY_ID is missing. Check your .env file and restart the dev server.");
        //     alert("Payment configuration error");
        //     setLoading(false);
        //     return;
        // }

        const options = {
            key: "rzp_test_TibyqCsHnU31GN",
            amount: razorpayOrder.amount,
            currency: "INR",
            name: "Cart7",
            description: "Purchase Description",
            order_id: razorpayOrder.id,
            handler: async function (response) {
                try {
                    const verifyRes = await axios.post(
                        `${API_URL}/api/order/verify-payment`,
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }
                    );

                    console.log("Verify response:", verifyRes.data);

                    if (verifyRes.data.success) {
                        navigate("/order-success");
                    } else {
                        // alert("Payment verification failed!");
                        Swal.fire({
                            title:"Payment",
                            text:verifyRes.data.message || "Payment verification Failed",
                            icon:"error",
                            confirmButtonText:"OK"
                        });
                        
                    }
                } catch (err) {
                    console.error(
                        "Verify error:",
                        err.response?.status,
                        err.response?.data || err.message
                    );
                    // alert("Payment verification failed!");
                    Swal.fire({
                            title:"Payment",
                            text:err.response?.data?.message || "Payment verification Failed",
                            icon:"error",
                            confirmButtonText:"OK"
                        });
                } finally {
                    setLoading(false);
                }
            },
            modal: {
                // user closed the popup without paying
                ondismiss: () => setLoading(false),
            },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", (resp) => {
            console.error("Payment failed:", resp.error);
            // alert(resp.error?.description || "Payment failed");
            Swal.fire({
                            title:"Payment",
                            text:resp.error?.description || "Payment failed",
                            icon:"error",
                            confirmButtonText:"OK"
                        });
            setLoading(false);
        });

        rzp.open();
    };

    // =========================================
    // PLACE ORDER
    // =========================================
    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            // alert("Please select a payment method");
            Swal.fire({
                            title:"Payment",
                            text:"Select the payment menthod",
                            // icon:"Fail",
                            confirmButtonText:"OK"
                        });
            return;
        }

        try {
            setLoading(true);

            const response = await placeOrder({ paymentMethod });

            console.log(response,"======response===");
            

            if (response?.success) {
                if (paymentMethod === "Online" && response?.razorpayOrder) {
                    await handlePayment(response.razorpayOrder);
                    return; // loading is reset inside Razorpay callbacks
                }
                navigate("/order-success");
            } else {
                // alert(response?.message || "Unable to place order");
                Swal.fire({
                            title:"Payment",
                            text:response?.message || "Unable to place the order",
                            icon:"error",
                            confirmButtonText:"OK"
                        });
            }
        } catch (error) {
            console.error("Error placing order:", error);
            console.error("Backend message:", error?.response?.data?.message);
            console.error("Skipped items:", error?.response?.data?.skippedItems);

            // alert(
            //     error?.response?.data?.message ||
            //         "Something went wrong while placing the order"
            // );
            Swal.fire({
                            // title:"Payment",
                            text:error?.response?.data?.message || "Something went wrong while placing the order",
                            // icon:"Fail",
                            confirmButtonText:"OK"
                        });
        }

        setLoading(false);
    };

    const options = [
        { value: "COD", title: "Cash on Delivery", desc: "Pay when your order is delivered" },
        { value: "Online", title: "Online Payment", desc: "Pay securely using online payment" },
    ];

    return (
        <div className="payment_section">
            <h2 className="payment_title">Payment Methods</h2>

            {options.map((opt) => (
                <div
                    key={opt.value}
                    className={`payment_option ${
                        paymentMethod === opt.value ? "payment_option_active" : ""
                    }`}
                    onClick={() => setPaymentMethod(opt.value)}
                >
                    <div className="payment_option_left">
                        <input
                            type="radio"
                            name="payment"
                            value={opt.value}
                            checked={paymentMethod === opt.value}
                            onChange={() => setPaymentMethod(opt.value)}
                        />
                        <div className="payment_text">
                            <h3>{opt.title}</h3>
                            <p>{opt.desc}</p>
                        </div>
                    </div>
                </div>
            ))}

            <button
                className="pay_now_button"
                onClick={handlePlaceOrder}
                disabled={loading}
            >
                {loading ? "Placing Order..." : "Pay Now"}
            </button>
        </div>
    );
};

export default Payment;