
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import "./SearchBar.css";
import UserService from "../../../../Services/UserService";

const SearchBar = ({ mobile = false }) => {

    const [query, setQuery] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(true);

    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    const { getProduct } = UserService();


    // ==========================================
    // GET ALL PRODUCTS
    // ==========================================

    useEffect(() => {

        const fetchAllProducts = async () => {

            try {

                setLoading(true);

                const response = await getProduct();

                console.log("Search API response:", response);

                /*
                 * Based on your Product_card component,
                 * products should be an array containing:
                 *
                 * {
                 *   _id,
                 *   product_name,
                 *   price,
                 *   image
                 * }
                 */

                setAllProducts(
                    Array.isArray(response)
                        ? response
                        : response?.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to fetch products for search:",
                    error
                );

                setAllProducts([]);

            } finally {

                setLoading(false);

            }

        };

        fetchAllProducts();

    }, []);


    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    useEffect(() => {

        const trimmedQuery = query.trim().toLowerCase();

        if (!trimmedQuery) {

            setResults([]);
            setShowDropdown(false);

            return;
        }


        const filteredProducts = allProducts.filter((product) => {

            const productName =
                product.product_name?.toLowerCase() || "";

            return productName.includes(trimmedQuery);

        });


        console.log("Search query:", trimmedQuery);
        console.log("Filtered products:", filteredProducts);


        setResults(filteredProducts.slice(0, 6));

        setShowDropdown(true);

    }, [query, allProducts]);


    // ==========================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // ==========================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {

                setShowDropdown(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // ==========================================
    // GO TO PRODUCTS SEARCH PAGE
    // ==========================================

    const goToResultsPage = () => {

        const trimmedQuery = query.trim();

        if (!trimmedQuery) return;

        setShowDropdown(false);

        navigate(
            `/products?search=${encodeURIComponent(trimmedQuery)}`
        );

    };


    // ==========================================
    // KEYBOARD
    // ==========================================

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {

            goToResultsPage();

        }

        if (event.key === "Escape") {

            setShowDropdown(false);

        }

    };


    // ==========================================
    // SELECT PRODUCT
    // ==========================================

    const handleSelectProduct = (product) => {

        setShowDropdown(false);

        setQuery("");

        navigate(`/product/${product._id}`);

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div
            className={`search-box-wrapper ${
                mobile ? "mobile" : ""
            }`}
            ref={wrapperRef}
        >

            {/* SEARCH BOX */}

            <div className="search-box">

                <CiSearch
                    size={16}
                    color="#aaa"
                    onClick={goToResultsPage}
                    style={{
                        cursor: "pointer"
                    }}
                />

                <input
                    type="search"
                    placeholder="Search Here"
                    value={query}
                    onChange={(event) =>
                        setQuery(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    onFocus={() => {

                        if (query.trim()) {

                            setShowDropdown(true);

                        }

                    }}
                />

            </div>


            {/* SEARCH DROPDOWN */}

            {showDropdown && (

                <div className="search-dropdown">


                    {/* LOADING */}

                    {loading && (

                        <div className="search-status">

                            Loading products...

                        </div>

                    )}


                    {/* NO RESULTS */}

                    {!loading &&
                        results.length === 0 && (

                            <div className="search-status">

                                No products found

                            </div>

                        )}


                    {/* RESULTS */}

                    {!loading &&
                        results.length > 0 &&
                        results.map((product) => (

                            <div
                                key={product._id}
                                className="search-result-item"
                                onClick={() =>
                                    handleSelectProduct(product)
                                }
                            >

                                {/* PRODUCT IMAGE */}

                                <img
                                    src={product.image}
                                    alt={product.product_name}
                                    className="search-result-img"
                                />


                                {/* PRODUCT DETAILS */}

                                <div className="search-result-info">

                                    <span className="search-result-name">

                                        {product.product_name}

                                    </span>


                                    <span className="search-result-price">

                                        ₹{product.price}

                                    </span>

                                </div>

                            </div>

                        ))}


                    {/* VIEW ALL */}

                    {!loading &&
                        results.length > 0 && (

                            <div
                                className="search-view-all"
                                onClick={goToResultsPage}
                            >

                                View all results for "{query}"

                            </div>

                        )}

                </div>

            )}

        </div>

    );

};


export default SearchBar;

