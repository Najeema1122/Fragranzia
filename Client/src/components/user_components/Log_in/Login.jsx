import React, { useState } from "react";
import "./Login.css";
import signup_left_image from "../../../assets/sign_up_left.jpg";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UserService from "../../../services/UserService";

const Login = () => {
    const navigate = useNavigate();
    const { login } = UserService();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [formErr, setFormErr] = useState({
        email: false,
        password: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const onHandleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onHandleBlur = (e) => {
        const { name } = e.target;
        let error = false;

        if (name === "email") {
            if (formData.email.trim() === "") {
                error = "empty";
            } else if (!validateEmail(formData.email)) {
                error = "invalid";
            }
        }

        if (name === "password" && formData.password.trim() === "") {
            error = true;
        }

        setFormErr((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        const errors = {
            email: false,
            password: false,
        };

        if (formData.email.trim() === "") {
            errors.email = "empty";
        } else if (!validateEmail(formData.email)) {
            errors.email = "invalid";
        }

        if (formData.password.trim() === "") {
            errors.password = true;
        }

        setFormErr(errors);

        if (errors.email || errors.password) return;

        setIsSubmitting(true);

        try {
            const data = await login(formData);

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            await Swal.fire({
                title: "Log In",
                text: "Logged in successfully",
                icon: "success",
                confirmButtonText: "OK",
            });

            setFormData({ email: "", password: "" });
            navigate("/");
        } catch (error) {
            await Swal.fire({
                title: "Log In",
                text: error.response?.data?.message || "Login failed",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="sign_up_container">
            <div className="sign_up_left_container">
                <img src={signup_left_image} alt="Login" />
            </div>

            <div className="sign_up_right_container">
                <div className="sign_up_social">
                    <button type="button">Google</button>
                    <button type="button">Facebook</button>
                </div>

                <form
                    onSubmit={onHandleSubmit}
                    autoComplete="off"
                    className="sign_up_form"
                >
                    <div className="sign_up_email">
                        <div className="hr">
                            <hr /> Or Login with Email <hr />
                        </div>

                        <div className="inputFields">
                            <div className="input_field">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="Enter your email"
                                    autoComplete="off"
                                    onChange={onHandleChange}
                                    onBlur={onHandleBlur}
                                />

                                {formErr.email === "empty" && (
                                    <span>Please enter your email</span>
                                )}

                                {formErr.email === "invalid" && (
                                    <span>Enter a valid email</span>
                                )}
                            </div>

                            <div className="input_field">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    placeholder="Enter your password"
                                    autoComplete="new-password"
                                    onChange={onHandleChange}
                                    onBlur={onHandleBlur}
                                />

                                {formErr.password && (
                                    <span>Please enter your password</span>
                                )}
                            </div>

                            <Link to="">Forgot Password?</Link>
                        </div>

                        <div className="signup_button">
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Log In"}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="login_link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;