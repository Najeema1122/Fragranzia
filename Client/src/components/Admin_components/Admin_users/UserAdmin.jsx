import React, { useEffect, useState } from "react";
import AdminService from "../../../Services/AdminService";
import "./User.css";

const UserAdmin = () => {
    const { getUsers, toggleBlockUser } = AdminService();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ========================================
    // GET USERS
    // ========================================

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const data = await getUsers();

            setUsers(data.users || []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ========================================
    // BLOCK / UNBLOCK USER
    // ========================================

    const handleBlockToggle = async (id) => {
        try {
            const res = await toggleBlockUser(id);

            setUsers((prev) =>
                prev.map((u) =>
                    u._id === id
                        ? {
                              ...u,
                              isBlocked: res.isBlocked,
                          }
                        : u
                )
            );
        } catch (err) {
            console.error("Failed to update user status:", err);
        }
    };

    // ========================================
    // LOADING
    // ========================================

    if (loading) {
        return (
            <div className="user-admin-page">
                <p className="user-loading">Loading users...</p>
            </div>
        );
    }

    // ========================================
    // ERROR
    // ========================================

    if (error) {
        return (
            <div className="user-admin-page">
                <p className="user-error">{error}</p>
            </div>
        );
    }

    // ========================================
    // UI
    // ========================================

    return (
        <div className="user-admin-page">

            {/* PAGE HEADER */}
            <div className="user-page-header">
                <h1>User List</h1>

                <p>
                    Manage registered customer accounts and status
                </p>
            </div>

            {/* USER TABLE */}
            <div className="user-table-container">

                <table className="user-table">

                    {/* TABLE HEADER */}
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody>

                        {users.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={5}
                                    className="user-empty"
                                >
                                    No users found
                                </td>
                            </tr>

                        ) : (

                            users.map((user, index) => (

                                <tr key={user._id}>

                                    {/* NAME */}
                                    <td className="user-name">
                                        {user.name || `user ${index + 1}`}
                                    </td>

                                    {/* PHONE */}
                                    <td>
                                        {user.phone || "-"}
                                    </td>

                                    {/* EMAIL */}
                                    <td className="user-email">
                                        {user.email || "-"}
                                    </td>

                                    {/* ACTION */}
                                    <td>
                                        <button
                                            className="show-button"
                                        >
                                            Show
                                        </button>
                                    </td>

                                    {/* STATUS */}
                                    <td>

                                        <button
                                            onClick={() =>
                                                handleBlockToggle(user._id)
                                            }
                                            className={
                                                user.isBlocked
                                                    ? "status-button unblock-button"
                                                    : "status-button block-button"
                                            }
                                        >
                                            {user.isBlocked
                                                ? "Unblock"
                                                : "Block"}
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default UserAdmin;