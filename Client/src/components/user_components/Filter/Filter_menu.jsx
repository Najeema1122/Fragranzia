import React from "react";
import './Filter_menu.css'
import { useState } from "react";

// import { IoClose } from "react-icons/io5";

const Filter_menu = () => {
    const filter_menu = ["Relevence", "Newest First", "Popularity", "Price--Low to High", "Price--High to Low"];
    const [open, setOpen] = useState(false);
    return (
        <div className="container">
            <div className="all_product"><p>All Product</p></div>

            {/* Desktop */}
            <div className="filter_menu">
                Sort By:
                {filter_menu.map((filter_link, index) => (
                    <a href="#" key={index}>{filter_link}</a>
                ))}
                <button>Filter</button>
            </div>



            {/* when in the case of tab and mobile */}
            {!open && (
                <button
                    className="filter_responsive"
                    onClick={() => setOpen(true)}
                >
                    Filter
                </button>
            )}

            <div className={`filter_menu_res ${open ? "open" : ""}`}>

                <div className="filter_menu_links">
                    {filter_menu.map((filter_link, index) => (
                        <a href="#" key={index}>
                            {filter_link}
                        </a>
                    ))}
                    <button
                        className="close_filter"
                        onClick={() => setOpen(false)}
                    >
                        Filter ✕
                    </button>
                </div>

            </div>

            {/* Mobile/Tablet
            <div className="filter_dropdown">
                <div className="dropdown_top">
                    <div className="dropdown_toggle">
                        Sort By <span className="arrow">▾</span>
                    </div>
                    <button className="filter_btn_mobile">Filter</button>
                </div>
            </div> */}
        </div>
    )
}
export default Filter_menu;