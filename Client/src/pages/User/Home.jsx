import React from "react";
import Navbar from "../../components/user_components/Navbar/Navbar";
import DiscountBar from "../../components/user_components/DiscountBar/DiscountBar";
import Carousal from "../../components/user_components/Carousel/Carousal";
import FeaturedCollection from "../../components/user_components/FeaturedCollection/FeaturedCollection";
import Footer from "../../components/user_components/Footer/Footer";
import Caption from "../../components/user_components/Caption_text/Caption";
import Exclusive_cat from "../../components/user_components/Exclusive_categories/Exclusive_cat";
import Explore_cat from "../../components/user_components/Explore_categories/Explore_cat";


const Home = ({products}) => {
   
   
    return (
        <>
         <Navbar/>
         <DiscountBar/>
         <Carousal/>
         <FeaturedCollection products={products}/>
         <Caption/>
         <Exclusive_cat/>
         <Explore_cat/>
         <Footer/>
        </>
    )
}
export default Home