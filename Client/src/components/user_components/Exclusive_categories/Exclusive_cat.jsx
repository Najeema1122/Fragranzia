import React from "react";
import './Exclusive_cat.css'
import newArrivels from '../../../assets/Frame40.png';
import limitedEdition from '../../../assets/Frame39.png';
import bestSellers from '../../../assets/Frame41.png';
import { Link } from "react-router-dom";



const Exclusive_cat = () => {
    return (<>
        <div className="exclusiveContainer">
            <div className="newArrivels"><Link rel="stylesheet" href="" to='/products'><img src={newArrivels} alt="" /></Link></div>
            <div className="limitedEdition"><Link rel="stylesheet" href="" to='/products' ><img src={limitedEdition} alt="" /></Link></div>
            <div className="BestSellers"><Link rel="stylesheet" href="" to='/products'><img src={bestSellers} alt="" /></Link></div>
        </div>
    </>)
}
export default Exclusive_cat;
