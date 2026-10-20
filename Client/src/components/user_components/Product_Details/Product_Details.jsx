
import React, { useState, useEffect } from "react";
import "./Product_Details.css";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserService from "../../../Services/UserService";

import Swal from "sweetalert2";

const Product_Details = ({ product }) => {

    const navigate = useNavigate();

    const {
        postCart,
        getWishList,
        postWishList,
        deleteWishList
    } = UserService();

    const [isWishlisted, setIsWishListed] = useState(false);


    // =====================================================
    // CHECK WISHLIST
    // =====================================================

    useEffect(() => {

        const checkWishlist = async () => {

            const token = localStorage.getItem("token");

            // If user is not logged in,
            // don't try to access wishlist API
            if (!token || !product?._id) {
                return;
            }

            try {

                const response = await getWishList();

                const wishlist = response;

                const exists = wishlist.some(
                    (item) => item.product?._id === product._id
                );

                setIsWishListed(exists);

            } catch (error) {

                console.log("Wishlist check error:", error);

            }
        };

        checkWishlist();

    }, [product]);


    // =====================================================
    // PRODUCT CHECK
    // =====================================================

    if (!product) {
        return <p>Product not found</p>;
    }


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = async (productId) => {

        // Get login token
        const token = localStorage.getItem("token");


        // -------------------------------------------------
        // USER NOT LOGGED IN
        // -------------------------------------------------

        if (!token) {

            // alert("Please login first");
            Swal.fire({
                            title:"Login",
                            text:"Please login first",
                            icon:"Fail",
                            confirmButtonText:"OK"
                        });

            navigate("/login");

            return;
        }


        // -------------------------------------------------
        // USER IS LOGGED IN
        // -------------------------------------------------

        try {

            await postCart({
                productId: productId
            });

            // After successfully adding product
            // go to cart page
            navigate("/cart");

        } catch (error) {

            console.log("Add to cart error:", error);


            // ---------------------------------------------
            // UNAUTHORIZED
            // ---------------------------------------------

            if (error.response?.status === 401) {

                // alert("Please login first");
                Swal.fire({
                            title:"Login",
                            text:"Please login first",
                            icon:"Fail",
                            confirmButtonText:"OK"
                        });

                // Remove invalid token
                localStorage.removeItem("token");

                navigate("/login");

                return;
            }


            // ---------------------------------------------
            // PRODUCT ALREADY IN CART
            // ---------------------------------------------

            if (error.response?.status === 400) {

                // alert(
                //     error.response?.data?.message ||
                //     "Product is already in cart"
                // );
                Swal.fire({
                            title:"Cart",
                            text:error.response?.data?.message || "Product is already in cart"
                        });

                navigate("/cart");

                return;
            }


            // ---------------------------------------------
            // OTHER ERROR
            // ---------------------------------------------

            // alert(
            //     error.response?.data?.message ||
            //     "Something went wrong"
            // );
            Swal.fire({
                            
                            text:error.response?.data?.message || "Something went wrong"
                        });
        }
    };


    // =====================================================
    // ADD TO WISHLIST
    // =====================================================

    const addToWishlist = async (productId) => {

        const token = localStorage.getItem("token");


        // User not logged in
        if (!token) {

            // alert("Please login first");
            Swal.fire({
                            title:"Login",
                            text:"Please login first",
                            icon:"Fail",
                            confirmButtonText:"OK"
                        });

            navigate("/login");

            return;
        }


        try {

            await postWishList({
                productId: productId
            });

            setIsWishListed(true);

        } catch (error) {

            console.log("Add wishlist error:", error);

        }
    };


    // =====================================================
    // REMOVE FROM WISHLIST
    // =====================================================

    const removeFromWishlist = async (productId) => {

        try {

            const res = await deleteWishList(productId);

            console.log("Delete response:", res);

            setIsWishListed(false);

        } catch (error) {

            console.log(
                "Delete wishlist error:",
                error.response?.data
            );

        }
    };


    // =====================================================
    // TOGGLE WISHLIST
    // =====================================================

    const handleWishlist = (productId) => {

        if (isWishlisted) {

            removeFromWishlist(productId);

        } else {

            addToWishlist(productId);

        }
    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div className="product_detail_section">

            {/* ==========================================
                LEFT SECTION
            ========================================== */}

            <div className="left_section">

                <div className="left_image_section">

                    {/* THUMBNAILS */}

                    <div className="thumbnails">

                        {/* <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.product_name}
                        />

                        <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.product_name}
                        />

                        <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.product_name}
                        /> */}

                         <img src={product.image} alt={product.product_name} />

                          <img src={product.image} alt={product.product_name} />

                           <img src={product.image} alt={product.product_name} />

                    </div>


                    {/* MAIN IMAGE */}

                    <div className="main_image">

                        {/* <img
                            src={`http://localhost:5000/uploads/${product.image}`}
                            alt={product.product_name}
                            
                        /> */}
                         <img src={product.image} alt={product.product_name} />


                        {/* WISHLIST + SHARE */}

                        <div className="wish_list">

                            <button
                                onClick={() =>
                                    handleWishlist(product._id)
                                }
                            >
                                <FaHeart
                                    color={
                                        isWishlisted
                                            ? "red"
                                            : "black"
                                    }
                                />
                            </button>


                            <button>
                                <FaShareAlt />
                            </button>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    BUY / CART BUTTONS
                ====================================== */}

                <div className="left_button_section">

                    <button className="buy_btn">
                        BUY NOW
                    </button>


                    <button
                        className="cart_btn"
                        onClick={() =>
                            addToCart(product._id)
                        }
                    >
                        ADD TO CART
                    </button>

                </div>

            </div>


            {/* ==========================================
                RIGHT DETAILS
            ========================================== */}

            <div className="right_details_section">

                <h1>
                    {product.product_name}
                </h1>


                <h2>
                    ₹ {product.price}
                </h2>


                <p>
                    {product.description}
                </p>

            </div>

        </div>
    );
};

export default Product_Details;

