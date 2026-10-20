import React, { useState, useEffect } from "react";
import "./Add_to_cart.css";
import { useNavigate } from "react-router-dom";
import UserService from "../../../Services/UserService";
import Swal from "sweetalert2";

const Add_to_cart = () => {

    const {
        getCart,
        postQuantity,
        deleteCartItem
    } = UserService();

    const navigate = useNavigate();

    const [cart, setCart] = useState([]);


    // =====================================================
    // FETCH CART
    // =====================================================

    useEffect(() => {

        fetchCart();

    }, []);


    const fetchCart = async () => {

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;
        }

        try {

            const response = await getCart();

            console.log("Cart:", response);

            setCart(response.cart || []);

        } catch (error) {

            console.log(
                error.response?.data || error
            );

        }
    };


    // =====================================================
    // UPDATE QUANTITY
    // =====================================================

    const addQuantity = async (
        productId,
        quantity
    ) => {

        const token = localStorage.getItem("token");

        if (!token) {

            // alert("Please login first");
            Swal.fire({
                            title:"Login",
                            text:"Please login first",
                            // icon:"success",
                            confirmButtonText:"OK"
                        });

            navigate("/login");

            return;
        }

        try {

            await postQuantity(
                productId,
                quantity
            );

            await fetchCart();

        } catch (error) {

            console.log(
                error.response?.data || error
            );

        }
    };


    // =====================================================
    // INCREASE
    // =====================================================

    const countInc = async (
        productId,
        currentQuantity
    ) => {

        const newQuantity =
            currentQuantity + 1;

        await addQuantity(
            productId,
            newQuantity
        );

    };


    // =====================================================
    // DECREASE
    // =====================================================

    const countDec = async (
        productId,
        currentQuantity
    ) => {

        if (currentQuantity <= 1) {

            return;
        }

        const newQuantity =
            currentQuantity - 1;

        await addQuantity(
            productId,
            newQuantity
        );

    };


    // =====================================================
    // TOTAL
    // =====================================================

    const total = cart.reduce(
        (sum, item) => {

            // Prevent error if product is null
            if (!item.product) {

                return sum;
            }

            const price =
                Number(item.product.price) || 0;

            return (
                sum +
                price * item.quantity
            );

        },
        0
    );


    // =====================================================
    // DELETE ITEM
    // =====================================================

    const deleteItem = async (productId) => {

        try {

            await deleteCartItem(productId);

            // Refresh cart
            await fetchCart();

        } catch (error) {

            console.log(
                error.response?.data || error
            );

        }
    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div className="add_cart_page">


            {/* ==========================================
                PAGE HEADER
            ========================================== */}

            <div className="cart_page_header">

                <h1>
                    Cart
                </h1>

                <p>
                    Home &gt; Cart
                </p>

            </div>



            {/* ==========================================
                MAIN CART SECTION
            ========================================== */}

            <div className="add_cart_container">


                {/* ==========================================
                    LEFT SIDE
                ========================================== */}

                <div className="cart_container_left">

                    {cart.length === 0 ? (

                        <div className="empty_cart">

                            <h3>
                                Your cart is empty
                            </h3>

                        </div>

                    ) : (

                        cart.map((item) => {

                            const product =
                                item.product;


                            // =================================
                            // SAFETY CHECK
                            // =================================

                            if (!product) {

                                return null;
                            }


                            const price =
                                Number(product.price) || 0;


                            return (

                                <div
                                    key={product._id}
                                    className="Cart_item"
                                >


                                    {/* ==================================
                                        IMAGE
                                    ================================== */}

                                    <div className="cart_item_image">

                                        {/* <img
                                            src={`http://localhost:5000/uploads/${product.image}`}
                                            alt={
                                                product.product_name
                                            }
                                        /> */}


                                        <img src={product.image} alt={product.product_name} />


                                    </div>



                                    {/* ==================================
                                        DETAILS
                                    ================================== */}

                                    <div className="cart_item_details">

                                        <h2>
                                            {
                                                product.product_name
                                            }
                                        </h2>



                                        {/* ==================================
                                            QUANTITY
                                        ================================== */}

                                        <div className="quantity_container">

                                            <button
                                                onClick={() =>
                                                    countDec(
                                                        product._id,
                                                        item.quantity
                                                    )
                                                }
                                            >
                                                -
                                            </button>


                                            <span>
                                                {
                                                    item.quantity
                                                }
                                            </span>


                                            <button
                                                onClick={() =>
                                                    countInc(
                                                        product._id,
                                                        item.quantity
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>



                                        {/* ==================================
                                            PRICE
                                        ================================== */}

                                        <div className="product_price">

                                            <span className="price">

                                                ₹ {price}

                                            </span>

                                        </div>



                                        {/* ==================================
                                            ACTION BUTTONS
                                        ================================== */}

                                        <div className="cart_action_buttons">

                                            <button
                                                className="delete_btn"
                                                onClick={() =>
                                                    deleteItem(
                                                        product._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>


                                            <button
                                                className="item_buy_btn"
                                                onClick={() =>
                                                    navigate(
                                                        "/payment"
                                                    )
                                                }
                                            >
                                                Buy
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })

                    )}

                </div>



                {/* ==========================================
                    RIGHT CHECKOUT
                ========================================== */}

                <div className="cart_container_right">

                    <div className="checkout_box">

                        <h2>
                            Check Out
                        </h2>



                        {/* ==================================
                            PRICE
                        ================================== */}

                        <div className="checkout_row">

                            <p>

                                Price ({cart.length} item
                                {cart.length !== 1
                                    ? "s"
                                    : ""})

                            </p>


                            <span>
                                ₹ {total}
                            </span>

                        </div>



                        {/* ==================================
                            DELIVERY
                        ================================== */}

                        <div className="checkout_row">

                            <p>
                                Delivery Charge
                            </p>

                            <span className="delivery_free">
                                Free
                            </span>

                        </div>



                        {/* ==================================
                            DIVIDER
                        ================================== */}

                        <div className="checkout_divider"></div>



                        {/* ==================================
                            TOTAL
                        ================================== */}

                        <div className="checkout_total">

                            <p>
                                Total Amount
                            </p>

                            <span>
                                ₹ {total}
                            </span>

                        </div>

                    </div>



                    {/* ==================================
                        PROCEED BUTTON
                    ================================== */}

                    <button
                        className="proceed_buy_btn"
                        onClick={() =>
                            navigate("/payment")
                        }
                        disabled={cart.length === 0}
                    >
                        Proceed to Buy
                    </button>



                    {/* ==================================
                        SECURITY TEXT
                    ================================== */}

                    <p className="checkout_note">

                        Safe and Secure Payments.
                        Easy returns.
                        100% Authentic products.

                    </p>

                </div>

            </div>

        </div>

    );

};

export default Add_to_cart;