import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
// adjust path if different
import "./SideMenu.css";
import { AuthContext } from "../../../Context/AuthContext";

const SideMenu = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profileImage");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    // Clear auth context state
    setAuth({});

    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>

      <ul>
        <li onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </li>

        <li onClick={() => navigate("/admin/add_product")}>
          Products
        </li>

        <li onClick={() => navigate("/admin/add_category")}>
          Categories
        </li>

        
        <li onClick={() => navigate("/admin/users")}>Customers</li>
        <li onClick={() => navigate("/admin/orders")}>Orders</li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SideMenu;