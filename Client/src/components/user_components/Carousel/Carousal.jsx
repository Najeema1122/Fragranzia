import React from "react";
import carousal1 from "../../../assets/Frame191.jpg";
import carousal2 from "../../../assets/Frame192.png";
import poster1 from "../../../assets/Frame10.png";
import poster2 from "../../../assets/Frame11.png";
import poster3 from "../../../assets/Frame12.png";
import './Carousal.css';                             // ← uncomment this

const Carousal = () => {
  return (
    <div className="nav-container"style={{ dispaly: "flex", flexDirection: "column",gap:"clamp(15px,2vw,30px)" }}>
      <div className="carousel-wrapper">             {/* ← add this div */}
        <div id="carouselExampleFade" className="carousel slide carousel-fade">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={carousal1} className="d-block w-100" alt="..." />
            </div>
            <div className="carousel-item">
              <img src={carousal2} className="d-block w-100" alt="..." />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>   
      <div className="adv_sec">
        <div className="adv"><img src={poster1} alt="" /></div>
        <div className="adv"><img src={poster3} alt="" /></div>
        <div className="adv"><img src={poster2} alt="" /></div>
        </div>                                      
    </div>
  );
};

export default Carousal;