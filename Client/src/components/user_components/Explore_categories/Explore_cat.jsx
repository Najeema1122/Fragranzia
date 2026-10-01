import React from "react";
import "./Explore_cat.css";
import { Link } from "react-router-dom";

import Eau_de_perfume from "../../../assets/SONGOFOUD_EDP_75ML_1.png";
import concentrated from "../../../assets/AURUM_CONCENTRATED_10ML_1.png";
import deodarants from "../../../assets/OUDMUSK_EDP_100ML_1.png";
import body_mist from "../../../assets/FACIN8_EDP_100ML_1.png";
import combo from "../../../assets/Mizyaan_ClasscOud_CP.png";

const Explore_cat = () => {
    const categories = [
        {
            image: Eau_de_perfume,
            name: "Eau De Perfume"
        },
        {
            image: concentrated,
            name: "Concentrated"
        },
        {
            image: deodarants,
            name: "Deodorants"
        },
        {
            image: body_mist,
            name: "Body Mist"
        },
        {
            image: combo,
            name: "Combo"
        }
    ];

    return (
        <>
            <div className="nav_container">
                <div className="ExploreCategories">
                    <div className="heading">
                        <p>Explore Categories</p>
                    </div>

                    <div className="seeAll_link">
                        <Link to="/categories">See All</Link>
                    </div>
                </div>

                <div className="category_menu">
                    {categories.map((category, index) => (
                        <div className="category_item" key={index}>
                            <Link to="/products">
                            <div className="category_menu_img">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                />
                            </div>

                            <div className="category_name">
                                <p>{category.name}</p>
                            </div></Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Explore_cat;