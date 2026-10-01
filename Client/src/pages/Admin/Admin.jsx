import React from "react";
import "./Admin.css";
import { Outlet } from "react-router-dom";
import SideMenu from "../../components/Admin_components/Admin_side_menu/SideMenu";
import ProductAdmin from "../../components/Admin_components/Admin_product/ProductAdmin";

const Admin = () => {
  return (
    <div className="admin-layout">

      {/* LEFT SIDEBAR */}
      <SideMenu />

      {/* RIGHT CONTENT */}
      <div className="content-area">
        <div className="content-area-topBar">
          <h3>Admin Panel</h3>
        </div>

        {/* EVERYTHING INSIDE PRODUCT ADMIN */}
        {/* <ProductAdmin/> */}
        <Outlet />

      </div>
    </div>
  )
};

export default Admin;