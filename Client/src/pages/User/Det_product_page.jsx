import React from "react";
import Navbar from "../../components/user_components/Navbar/Navbar";
import Product_Details from "../../components/user_components/Product_Details/Product_Details";
import Footer from "../../components/user_components/Footer/Footer";
import { useParams } from "react-router-dom";  // ✅

const Det_product_page = ({ products = [] }) => {  // ✅ receive products

    const { id } = useParams();  // ✅ get id from URL
    console.log("products:", products);


    console.log("url id:", id);
    console.log("typeof id:", typeof id);
    const product = products.find((p) => p._id === id);

    console.log("Found product:", product); // ✅ find product
    console.log("products[0]:", products[0]);


    return (
        <>
            <Navbar />
            <Product_Details product={product} />  {/* ✅ pass product */}
            <Footer />
        </>
    );
};

export default Det_product_page;