import React from "react";
import axios from "axios";
import './Signup.css';
import { useState } from "react";
import signup_left_image from "../../../assets/sign_up_left.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    let [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false
    })
    let [formErr, setformErr] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
        agree: false

    })
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const onHandleChange = (e) => {
        let { name, value, type, checked } = e.target
        if (type === "checkbox" && name === "agree") {
            setFormData(prev => ({
                ...prev,
                agree: checked
            }))
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }
    const onHandleSubmit = async (e) => {
        e.preventDefault();

        let next = true;

        let err = {
            name: false,
            email: false,
            password: false,
            confirmPassword: false,
            agree: false
        };

        if (formData.name.trim() === "") {
            next = false;
            err.name = true;
        }

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

        if (formData.confirmPassword.trim() === "") {
            next = false;
            err.confirmPassword = "empty";
        } else if (formData.password !== formData.confirmPassword) {
            next = false;
            err.confirmPassword = "mismatch";
        }

        if (!formData.agree) {
            next = false;
            err.agree = true;
        }

        setformErr(err);

        if (!next) return;

        try {
            const res = await axios.post(
                "http://localhost:5000/auth/register",
                formData
            );

            alert(res.data.message);

            // Clear form
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                agree: false
            });

            // Clear errors
            setformErr({
                name: false,
                email: false,
                password: false,
                confirmPassword: false,
                agree: false
            });

            // Navigate to login page
            navigate("/login");

        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    let onHandleBlur = (e) => {
        const { name } = e.target;

        let err = false;

        if (name === "name") {
            if (formData.name.trim() === "") {
                err = true;
            }
        }

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

        if (name === "confirmPassword") {
            if (formData.confirmPassword.trim() === "") {
                err = "empty";
            } else if (formData.password !== formData.confirmPassword) {
                err = "mismatch";
            }
        }

        setformErr(prev => ({
            ...prev,
            [name]: err
        }));
    };

    return (
        <>
            <div className="sign_up_container">
                <div className="sign_up_left_container">
                    <img src={signup_left_image} alt="" />
                </div>
                <div className="sign_up_right_container">
                    <div className="sign_up_social">
                        <div><button><a href="">Google</a></button></div>
                        <div><button><a href="">Facebook</a></button></div>
                    </div>
                    <form action="" onSubmit={onHandleSubmit} autoComplete="off" className="sign_up_form">
                        <div className="sign_up_email">
                            <div className="hr"><hr />Or SignUP with Email <hr /></div>
                            <div className="inputFields">
                                <div className="input_field">
                                    <input
                                        className="form-name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        placeholder="Enter your user name"
                                        onChange={onHandleChange}
                                        onBlur={onHandleBlur}
                                    />
                                    {formErr.name && <span>please fill</span>}
                                </div>
                                <div className="input_field">
                                <input
                                    className="form-name"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="Enter your email"
                                    onChange={onHandleChange}
                                    onBlur={onHandleBlur}
                                />
                                {formErr.email === "empty" && <span>Please enter your email</span>}
                                {formErr.email === "invalid" && <span>Enter a valid email (e.g. name@example.com)</span>}

                            </div>
                            <div className="input_field">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    placeholder="Enter your password"
                                    onChange={onHandleChange}
                                    onBlur={onHandleBlur}
                                />
                                {formErr.password && <span>Please enter the password</span>}
                            </div>
                            <div className="input_field">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    placeholder="Confirm password"
                                    onChange={onHandleChange}
                                    onBlur={onHandleBlur}
                                />
                                {formErr.confirmPassword === "empty" && <span>Please confirm your password</span>}
                                {formErr.confirmPassword === "mismatch" && <span>Passwords do not match</span>}
                            </div>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    name="agree"
                                    checked={formData.agree}
                                    onChange={onHandleChange}
                                />
                                I agree to the <a href="/terms">Terms & Conditions</a>
                            </label>
                            {formErr.agree && <span>you must agree to continue</span>}
                        </div>
                        <div className="signup_button">
                            <button>Signup</button>
                        </div>
                </div>
            </form>
            <div className="login_link">Already having an account <Link to={"/login"}>login</Link></div>
        </div >


            </div >
        </>
    )
}

export default Signup;