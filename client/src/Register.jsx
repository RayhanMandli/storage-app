import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
    const BASE_URL = "http://localhost:4000";

    const [formData, setFormData] = useState({
        name: "Rayhan Mandli",
        email: "mandlirayhan@gmail.com",
        password: "abcd",
        otp: "",
    });

    // serverError will hold the error message from the server
    const [serverError, setServerError] = useState("");

    const [isSuccess, setIsSuccess] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear the server error as soon as the user starts typing in Email
        if (name === "email" && serverError) {
            setServerError("");
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSuccess(false); // reset success if any
        const verifyOtp = await handleOtpVerify();
        if (!verifyOtp) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.error) {
                // Show error below the email field (e.g., "Email already exists")
                setServerError(data.error);
            } else {
                // Registration success
                setIsSuccess(true);
                console.log(data.message);
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (error) {
            // In case fetch fails
            console.error("Error:", error);
            setServerError("Something went wrong. Please try again.");
        }
    };

    const handleOtpSent = async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/send-otp`, {
                method: "POST",
                body: JSON.stringify({ email: formData.email }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (data.error) {
                setServerError(data.error);
            }
        } catch (error) {
            // In case fetch fails
            console.error("Error:", error);
            setServerError("Something went wrong. Please try again.");
        }
    };

    const handleOtpVerify = async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
                method: "POST",
                body: JSON.stringify({
                    otp: formData.otp,
                    email: formData.email,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.error) {
                setServerError(data.error);
                return false;
            } else {
                console.log(data.message);
                return true;
            }
        } catch (error) {
            // In case fetch fails
            console.error("Error:", error);
            setServerError("Something went wrong. Please try again.");
        }
    };
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/google`, {
                method: "POST",
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (response.ok) {
                navigate("/");
            } else {
                console.log("Google Login Failed");
                const data = await response.json();
                setServerError(data.error || "Google Login Failed");
            }
        } catch (error) {
            console.error("Error:", error);
            setServerError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="container">
            <h2 className="heading">Register</h2>
            <form className="form" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="form-group">
                    <label htmlFor="name" className="label">
                        Name
                    </label>
                    <input
                        className="input"
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email" className="label">
                        Email
                    </label>
                    <input
                        // If there's a serverError, add an extra class to highlight border
                        className={`input ${serverError ? "input-error" : ""}`}
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                    <button
                        type="button"
                        className="otp-button"
                        onClick={() => {
                            setOtpSent(true);
                            handleOtpSent();
                        }}
                    >
                        Send OTP
                    </button>

                    {/* Absolutely-positioned error message below email field */}
                    {serverError && (
                        <span className="error-msg">{serverError}</span>
                    )}
                </div>
                {/* Otp */}
                {otpSent && (
                    <div className="form-group">
                        <label htmlFor="otp" className="label">
                            Otp
                        </label>
                        <input
                            // If there's a serverError, add an extra class to highlight border
                            className={`input ${
                                serverError ? "input-error" : ""
                            }`}
                            type="text"
                            id="otp"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            placeholder="Enter your OTP"
                            required
                        />

                        {/* Absolutely-positioned error message below email field */}
                        {serverError && (
                            <span className="error-msg">{serverError}</span>
                        )}
                    </div>
                )}
                {/* Password */}
                <div className="form-group">
                    <label htmlFor="password" className="label">
                        Password
                    </label>
                    <input
                        className="input"
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`submit-button ${isSuccess ? "success" : ""}`}
                >
                    {isSuccess ? "Registration Successful" : "Register"}
                </button>
            </form>
            {/* Google Login Button */}
            <div className="google-login">
                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        handleGoogleLogin(credentialResponse);
                    }}
                    onError={() => {
                        console.log("Login Failed");
                    }}
                    useOneTap
                />
            </div>
            {/* Link to the login page */}
            <p className="link-text">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;
