import React, { useEffect, useState } from "react";
import UserService from "../../../Services/UserService";
import "./Cart_Summary.css";

const Cart_Summary = () => {
    const { getCart } = UserService();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getCart();
                setCart(response.cart);
            } catch (error) {
                console.log("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    if (loading) return null;

    const totalPrice = cart.reduce(
        (total, item) => total + (item.product.price * item.quantity),
        0
    );

    return (
        <div className="cart_summary">
            <h3>Order Summary</h3>

            <div className="summary_row">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
            </div>

            <div className="summary_row">
                <span>Delivery</span>
                <span>Free</span>
            </div>

            <hr />

            <div className="summary_total">
                <span>Total</span>
                <span>₹{totalPrice}</span>
            </div>
        </div>
    );
};

export default Cart_Summary;