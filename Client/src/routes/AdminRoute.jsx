import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserService from "../Services/UserService";

const AdminRoute = () => {

    const { getProfile } = UserService();

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {

        const checkAdmin = async () => {

            try {

                const token = localStorage.getItem("token");

                // =========================
                // NOT LOGGED IN
                // =========================

                if (!token) {
                    setIsAdmin(false);
                    setLoading(false);
                    return;
                }

                // =========================
                // GET CURRENT USER
                // =========================

                const response = await getProfile();

                console.log(
                    "Admin Route Profile:",
                    response
                );

                // getProfile returns:
                // {
                //   success: true,
                //   user: {...}
                // }

                if (response?.user?.role === "admin") {

                    setIsAdmin(true);

                } else {

                    setIsAdmin(false);
                }

            } catch (error) {

                console.error(
                    "Admin check error:",
                    error
                );

                setIsAdmin(false);

            } finally {

                setLoading(false);
            }
        };

        checkAdmin();

    }, []);

    // =========================
    // CHECKING
    // =========================

    if (loading) {

        return (
            <div>
                Checking access...
            </div>
        );
    }

    // =========================
    // NOT ADMIN
    // =========================

    if (!isAdmin) {

        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // =========================
    // ADMIN
    // =========================

    return <Outlet />;
};

export default AdminRoute;