import React, { useState, useEffect } from "react";
import "./Navbar.css";
import {
    CiShoppingCart,
    CiBellOn,
    CiUser,
    CiHeart
} from "react-icons/ci";
import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import SearchBar from "./SearchBar/SearchBar";
import UserService from "../../../Services/UserService";


const Navbar = () => {

    const navigate = useNavigate();

    const { pathname } = useLocation();

    const [open, setOpen] = useState(false);

    const [wishlistCount, setWishlistCount] = useState(0);

    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const { getWishList } = UserService();


    // =====================================================
    // CHECK LOGIN STATUS
    // =====================================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        setIsLoggedIn(!!token);

    }, [pathname]);


    // =====================================================
    // FETCH WISHLIST COUNT
    // =====================================================

    const fetchWishlist = async () => {

        const token = localStorage.getItem("token");

        if (!token) {

            setWishlistCount(0);

            return;
        }

        try {

            const data = await getWishList();

            setWishlistCount(data?.length || 0);

        } catch (err) {

            console.error(
                "Failed to fetch wishlist count",
                err
            );

            setWishlistCount(0);
        }
    };


    // Refetch on route change

    useEffect(() => {

        fetchWishlist();

    }, [pathname]);


    // Refetch whenever the wishlist is changed anywhere in the app
    // (Wishlist page dispatches "wishlistUpdated" after add/remove)

    useEffect(() => {

        window.addEventListener(
            "wishlistUpdated",
            fetchWishlist
        );

        return () => {
            window.removeEventListener(
                "wishlistUpdated",
                fetchWishlist
            );
        };

    }, []);


    // =====================================================
    // PROTECTED NAVIGATION
    // =====================================================

    const handleProtectedNavigation = (path) => {

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first");

            navigate("/login");

            setOpen(false);

            return;
        }

        navigate(path);

        setOpen(false);
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const onHandleLogout = () => {

        localStorage.removeItem("token");

        setIsLoggedIn(false);

        setWishlistCount(0);

        setOpen(false);

        alert("Logout Successfully");

        navigate("/");
    };


    return (

        <nav className="navbar">

            <div className="nav-container">


                {/* LOGO */}

                <Link to="/">

                    <div className="logo">
                        Fragranzia
                    </div>

                </Link>


                {/* DESKTOP RIGHT SECTION */}

                <div className="right">


                    {/* MENU */}

                    <ul className="menu">

                        <li className={pathname === "/" ? "active" : ""}>
                            <Link to="/">Home</Link>
                        </li>

                        <li className={pathname === "/products" ? "active" : ""}>
                            <Link to="/products">Product</Link>
                        </li>

                        <li className={pathname === "/gifting" ? "active" : ""}>
                            <Link to="/gifting">Gifting</Link>
                        </li>

                        <li className={pathname === "/about" ? "active" : ""}>
                            <Link to="/about">About</Link>
                        </li>

                    </ul>


                    {/* SEARCH */}

                    <SearchBar />


                    {/* WISHLIST */}

                    <div
                        className={`icon-btn ${
                            pathname === "/wishlist" ? "active" : ""
                        }`}
                    >

                        <button
                            onClick={() =>
                                handleProtectedNavigation("/wishlist")
                            }
                            style={{
                                position: "relative",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                padding: 0
                            }}
                        >

                            <CiHeart size={18} />

                            {isLoggedIn && wishlistCount > 0 && (

                                <span className="wishlist-count">
                                    {wishlistCount}
                                </span>

                            )}

                        </button>

                    </div>


                    {/* CART */}

                    <div
                        className={`icon-btn ${
                            pathname === "/cart" ? "active" : ""
                        }`}
                    >

                        <button
                            onClick={() =>
                                handleProtectedNavigation("/cart")
                            }
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                padding: 0
                            }}
                        >

                            <CiShoppingCart size={18} />

                        </button>

                    </div>


                    {/* NOTIFICATION */}

                    <div className="icon-btn">

                        <CiBellOn size={18} />

                    </div>


                    {/* PROFILE */}

                    <div
                        className={`icon-btn ${
                            pathname === "/profile" ? "active" : ""
                        }`}
                    >

                        <button
                            onClick={() =>
                                handleProtectedNavigation("/profile")
                            }
                            style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                padding: 0
                            }}
                        >

                            <CiUser size={18} />

                        </button>

                    </div>


                    {/* LOGOUT */}

                    {isLoggedIn && (

                        <button
                            className="logout-button"
                            onClick={onHandleLogout}
                        >
                            Logout
                        </button>

                    )}

                </div>


                {/* HAMBURGER */}

                <button
                    className={`hamburger ${open ? "open" : ""}`}
                    onClick={() => setOpen(!open)}
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </button>

            </div>


            {/* MOBILE MENU */}

            <div className={`mobile-menu ${open ? "open" : ""}`}>


                {/* SEARCH */}

                <SearchBar mobile />


                {/* MOBILE NAVIGATION */}

                <ul className="mobile-nav-links">

                    <li className={pathname === "/" ? "active" : ""}>
                        <Link to="/" onClick={() => setOpen(false)}>
                            Home
                        </Link>
                    </li>

                    <li className={pathname === "/products" ? "active" : ""}>
                        <Link to="/products" onClick={() => setOpen(false)}>
                            Products
                        </Link>
                    </li>

                    <li className={pathname === "/gifting" ? "active" : ""}>
                        <Link to="/gifting" onClick={() => setOpen(false)}>
                            Gifting
                        </Link>
                    </li>

                    <li className={pathname === "/about" ? "active" : ""}>
                        <Link to="/about" onClick={() => setOpen(false)}>
                            About
                        </Link>
                    </li>

                </ul>


                {/* MOBILE ICONS */}

                <div className="mobile-icons">


                    {/* WISHLIST */}

                    <button
                        className="icon-btn"
                        onClick={() =>
                            handleProtectedNavigation("/wishlist")
                        }
                    >

                        <CiHeart size={18} />

                    </button>


                    {/* CART */}

                    <button
                        className="icon-btn"
                        onClick={() =>
                            handleProtectedNavigation("/cart")
                        }
                    >

                        <CiShoppingCart size={18} />

                    </button>


                    {/* NOTIFICATION */}

                    <button className="icon-btn">

                        <CiBellOn size={18} />

                    </button>


                    {/* PROFILE */}

                    <button
                        className="icon-btn"
                        onClick={() =>
                            handleProtectedNavigation("/profile")
                        }
                    >

                        <CiUser size={18} />

                    </button>


                    {/* LOGOUT */}

                    {isLoggedIn && (

                        <button
                            className="logout-button mobile-logout-button"
                            onClick={onHandleLogout}
                        >
                            Logout
                        </button>

                    )}

                </div>

            </div>

        </nav>
    );
};


export default Navbar;