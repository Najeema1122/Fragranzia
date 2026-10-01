
import React, { useState, useEffect } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import newBadge from "../../../assets/newBadge.png";
import "./FeaturedCollection.css";
import { useNavigate } from "react-router-dom";
import UserService from "../../../Services/UserService";

const SLIDE_BY = 2;

const FeaturedCollection = ({ products = [] }) => {

    const navigate = useNavigate();

    const { postCart } = UserService();

    const [startIndex, setStartIndex] = useState(0);
    const [viewPerLoad, setViewPerLoad] = useState(3);


    // =====================================================
    // RESPONSIVE PRODUCTS COUNT
    // =====================================================

    useEffect(() => {

        const updateViewCount = () => {

            if (window.innerWidth <= 1024) {

                setViewPerLoad(2);

            } else {

                setViewPerLoad(3);

            }
        };


        updateViewCount();

        window.addEventListener(
            "resize",
            updateViewCount
        );


        return () => {

            window.removeEventListener(
                "resize",
                updateViewCount
            );

        };

    }, []);


    // =====================================================
    // RIGHT ARROW
    // =====================================================

    const handleRight = () => {

        setStartIndex((prev) =>
            Math.min(
                prev + SLIDE_BY,
                Math.max(
                    products.length - viewPerLoad,
                    0
                )
            )
        );

    };


    // =====================================================
    // LEFT ARROW
    // =====================================================

    const handleLeft = () => {

        setStartIndex((prev) =>
            Math.max(
                prev - SLIDE_BY,
                0
            )
        );

    };


    // =====================================================
    // ADD TO CART
    // =====================================================

    const addToCart = async (productId) => {

        // -------------------------------------------------
        // CHECK LOGIN
        // -------------------------------------------------

        const token =
            localStorage.getItem("token");


        if (!token) {

            alert("Please login first");

            navigate("/login");

            return;
        }


        // -------------------------------------------------
        // ADD PRODUCT TO CART
        // -------------------------------------------------

        try {

            await postCart({
                productId: productId
            });


            // Product successfully added
            alert("Product added to cart");

            // navigate("/cart");


        } catch (error) {

            console.log(
                "Add to cart error:",
                error
            );


            // -------------------------------------------------
            // UNAUTHORIZED
            // -------------------------------------------------

            if (
                error.response?.status === 401
            ) {

                alert("Please login first");

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }


            // -------------------------------------------------
            // PRODUCT ALREADY IN CART
            // -------------------------------------------------

            if (
                error.response?.status === 400
            ) {

                alert(
                    error.response?.data?.message ||
                    "Product is already in cart"
                );

                navigate("/cart");

                return;
            }


            // -------------------------------------------------
            // OTHER ERROR
            // -------------------------------------------------

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }

    };


    // =====================================================
    // VISIBLE PRODUCTS
    // =====================================================

    const visibleProducts = products.slice(
        startIndex,
        startIndex + viewPerLoad
    );


    const hasNext =
        startIndex + viewPerLoad <
        products.length;


    const hasPrev =
        startIndex > 0;


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div
            className="nav-container"
            style={{
                flexDirection: "column"
            }}
        >

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="Featured_collection">

                <div className="heading">
                    Featured Collection
                </div>


                <div className="Right_buttons">

                    <button
                        onClick={handleLeft}
                        disabled={!hasPrev}
                    >
                        <FaAngleLeft />
                    </button>


                    <button
                        onClick={handleRight}
                        disabled={!hasNext}
                    >
                        <FaAngleRight />
                    </button>

                </div>

            </div>


            {/* =========================================
                PRODUCTS
            ========================================= */}

            <div className="ViewSection">

                {visibleProducts.map((product) => (

                    <div
                        key={product._id}
                        className="product_card"
                    >

                        {/* PRODUCT IMAGE */}

                        <div
                            className="product_card_img"
                            style={{
                                position: "relative"
                            }}
                        >

                            {/* <img
                                src={`http://localhost:5000/uploads/${product.image}`}
                                alt={product.product_name}
                            /> */}
                             <img src={product.image} alt={product.product_name} />


                            <div className="newBadge">

                                <img
                                    src={newBadge}
                                    alt="New"
                                />

                            </div>

                        </div>


                        {/* PRODUCT NAME */}

                        <div className="product_card_name">

                            <p>
                                {product.product_name}
                            </p>

                        </div>


                        {/* PRICE */}

                        <div className="price">

                            <p>
                                RS {product.price}
                            </p>

                        </div>


                        {/* ADD TO CART */}

                        <div className="product_card_btn">

                            <button
                                onClick={() =>
                                    addToCart(product._id)
                                }
                            >
                                Add to cart
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

};

export default FeaturedCollection;

