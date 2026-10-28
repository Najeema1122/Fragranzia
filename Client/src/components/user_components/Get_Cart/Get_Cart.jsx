import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../../Services/UserService";
import "./Get_Cart.css";

const Get_Cart = () => {
    const { getCart } = UserService();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

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

    if (loading) {
        return <p>Loading cart...</p>;
    }

    return (
        <div className="cart_container">

            <h2>My Cart</h2>

            {cart.length === 0 ? (
                <div className="empty_cart">
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <div className="cart_items">
                    {cart.map((item) => (
                        <div className="cart_item" key={item.product._id}>

                            <div className="cart_image">
                                 <img src={item.product.image} alt={item.product.product_name} />
                            </div>

                            <div className="cart_item_details">
                                <h3>{item.product.product_name}</h3>
                                <p>Price: ₹{item.product.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Subtotal: ₹{item.product.price * item.quantity}</p>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Get_Cart;