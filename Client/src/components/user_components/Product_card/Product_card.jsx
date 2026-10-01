import React, { useState, useEffect } from "react";
import "./Product_card.css";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import UserService from "../../../Services/UserService"; // ⚠️ adjust this path to where Product_card.jsx lives

const ITEMS_PER_LOAD = 9;

const Product_card = ({ products = [] }) => {

    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
    const [wishlistIds, setWishlistIds] = useState([]); // ids of wishlisted products
    const navigate = useNavigate();

    const { getWishList, postWishList, deleteWishList } = UserService();

    // =====================================================
    // LOAD WISHLIST ONCE
    // =====================================================
    useEffect(() => {

        const loadWishlist = async () => {

            const token = localStorage.getItem("token");

            // not logged in -> nothing to load
            if (!token) return;

            try {
                const response = await getWishList();

                const ids = response
                    .map((item) => item.product?._id)
                    .filter(Boolean);

                setWishlistIds(ids);

            } catch (error) {
                console.log("Wishlist load error:", error);
            }
        };

        loadWishlist();

    }, []);

    // =====================================================
    // TOGGLE WISHLIST
    // =====================================================
    const handleWishlist = async (e, productId) => {

        e.stopPropagation(); // don't trigger the card click (navigation)

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        const isWishlisted = wishlistIds.includes(productId);

        try {

            if (isWishlisted) {
                await deleteWishList(productId);
                setWishlistIds((prev) => prev.filter((id) => id !== productId));
            } else {
                await postWishList({ productId });
                setWishlistIds((prev) => [...prev, productId]);
            }

        } catch (error) {

            console.log("Wishlist error:", error.response?.data || error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
    };

    const visibleProducts = products.slice(0, visibleCount);
    const hasMore = visibleCount < products.length;

    return (
        <>
            <div className="product_disp">
                {visibleProducts.map((product) => (
                    <div
                        className="product_card"
                        key={product._id}
                        onClick={() => navigate(`/product/${product._id}`)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="product_card_img">

                            <img src={product.image} alt={product.product_name} />

                            {/* HEART */}
                            <button
                                className="card_wishlist_btn"
                                onClick={(e) => handleWishlist(e, product._id)}
                            >
                                <FaHeart
                                    color={
                                        wishlistIds.includes(product._id)
                                            ? "red"
                                            : "#bbb"
                                    }
                                />
                            </button>

                        </div>

                        <div className="product_card_name"><p>{product.product_name}</p></div>
                        <div className="price"><p>RS {product.price}</p></div>

                        <div className="product_card_btn">
                            <button onClick={(e) => e.stopPropagation()}>
                                Add to cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="load_more_container">
                    <button className="load_more_btn" onClick={handleLoadMore}>
                        Load More
                    </button>
                </div>
            )}
        </>
    );
};

export default Product_card;