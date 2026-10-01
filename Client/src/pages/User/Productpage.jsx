import React from "react";
import Navbar from "../../components/user_components/Navbar/Navbar";
import DiscountBar from "../../components/user_components/DiscountBar/DiscountBar";
import Footer from "../../components/user_components/Footer/Footer";
import Filter_menu from "../../components/user_components/Filter/Filter_menu";
import Product_card from "../../components/user_components/Product_card/Product_card";


const Productpage = ({ products }) => {  {/* ✅ receive products prop */}

    return (
        <>
            <Navbar />
            <DiscountBar />
            <Filter_menu />
            <Product_card products={products} />  {/* ✅ forward to Product_card */}
            <Footer />
        </>
    )
}
export default Productpage;