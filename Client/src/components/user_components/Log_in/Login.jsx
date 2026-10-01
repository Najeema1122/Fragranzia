import React, { useState } from "react";
import "./Login.css";
import signup_left_image from "../../../assets/sign_up_left.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [formErr, setFormErr] = useState({
        email: false,
        password: false,
    });

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const onHandleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        let next = true;

        const err = {
            email: false,
            password: false,
        };

        if (formData.email.trim() === "") {
            next = false;
            err.email = "empty";
        } else if (!validateEmail(formData.email)) {
            next = false;
            err.email = "invalid";
        }

        if (formData.password.trim() === "") {
            next = false;
            err.password = true;
        }

        setFormErr(err);

        if (!next) return;

        try {
            const res = await axios.post(
                "http://localhost:5000/auth/login",
                formData
            );

            alert(res.data.message);

            // Save JWT token
            localStorage.setItem("token", res.data.token);

            // Clear form
            setFormData({
                email: "",
                password: "",
            });

            // Navigate to home
            navigate("/");

        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    const onHandleBlur = (e) => {
        const { name } = e.target;

        let err = false;

        if (name === "email") {
            if (formData.email.trim() === "") {
                err = "empty";
            } else if (!validateEmail(formData.email)) {
                err = "invalid";
            }
        }

        if (name === "password") {
            if (formData.password.trim() === "") {
                err = true;
            }
        }

        setFormErr((prev) => ({
            ...prev,
            [name]: err,
        }));
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
                            <button type="submit">
                                Log In
                            </button>
                        </div>

                    </div>
                </form>

                <div className="login_link">
                    Don't have an account?{" "}
                    <Link to="/signup">Sign Up</Link>
                </div>

            </div>
        </div>
    );
};

export default Login;