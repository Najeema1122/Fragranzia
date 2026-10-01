import React, { useState, useEffect } from "react";
import { CiTrash } from "react-icons/ci";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import UserService from "../../../Services/UserService";

const Wishlist = () => {

    const navigate = useNavigate();

    const {
        getWishList,
        deleteWishList,
        postCart
    } = UserService();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);


    // ========================================
    // FETCH WISHLIST
    // ========================================

    const fetchWishlist = async () => {
        try {
            setLoading(true);

            const data = await getWishList();

            setItems(data || []);

        } catch (error) {

            console.error(
                "Failed to fetch wishlist:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchWishlist();
    }, []);


    // ========================================
    // REMOVE FROM WISHLIST
    // ========================================

    const handleRemove = async (productId) => {

        try {

            await deleteWishList(productId);

            // Remove from UI only after
            // backend deletion succeeds

            setItems((prev) =>
                prev.filter(
                    (item) =>
                        item.product?._id !== productId
                )
            );

            // Tell the navbar the wishlist changed
            // so it can refresh its count

            window.dispatchEvent(
                new Event("wishlistUpdated")
            );

        } catch (error) {

            console.error(
                "Failed to remove wishlist item:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to remove item from wishlist"
            );
        }
    };


    // ========================================
    // ADD TO CART
    // ========================================

    const addToCart = async (productId) => {

        const token = localStorage.getItem("token");

        // USER NOT LOGGED IN

        if (!token) {

            alert("Please login first");

            navigate("/login");

            return;
        }

        // USER IS LOGGED IN

        try {

            await postCart({
                productId: productId
            });

            navigate("/cart");

        } catch (error) {

            console.log(
                "Add to cart error:",
                error
            );

            // UNAUTHORIZED

            if (error.response?.status === 401) {

                alert("Please login first");

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }

            // PRODUCT ALREADY IN CART

            if (error.response?.status === 400) {

                alert(
                    error.response?.data?.message ||
                    "Product is already in cart"
                );

                navigate("/cart");

                return;
            }

            // OTHER ERROR

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div className="wishlist-loading">
                Loading wishlist...
            </div>
        );

    }


    // ========================================
    // EMPTY WISHLIST
    // ========================================

    if (items.length === 0) {

        return (
            <div className="wishlist-empty">

                <h2>
                    Your wishlist is empty
                </h2>

                <p>
                    Save items you love and they’ll
                    show up here.
                </p>

            </div>
        );

    }


    // ========================================
    // WISHLIST PAGE
    // ========================================

    return (

        <div className="wishlist-page">

            <h2>
                My Wishlist ({items.length})
            </h2>


            <div className="wishlist-grid">

                {items.map((item) => (

                    <div
                        className="wishlist-card"
                        key={item._id}
                    >

                        {/* PRODUCT IMAGE */}

                        <div className="wishlist-image">

                            <img
                                src={item.product?.image}
                                alt={
                                    item.product?.product_name ||
                                    "Product"
                                }
                            />

                        </div>


                        {/* PRODUCT DETAILS */}

                        <div className="wishlist-details">

                            <h4>
                                {item.product?.product_name}
                            </h4>

                            <p>
                                ₹ {item.product?.price}
                            </p>


                            {/* ADD TO CART */}

                            <button
                                className="wishlist-cart-btn"
                                onClick={() =>
                                    addToCart(
                                        item.product?._id
                                    )
                                }
                            >
                                ADD TO CART
                            </button>


                            {/* REMOVE */}

                            <button
                                className="wishlist-remove-btn"
                                onClick={() =>
                                    handleRemove(
                                        item.product?._id
                                    )
                                }
                            >

                                <CiTrash size={18} />

                                Remove

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
};

export default Wishlist;