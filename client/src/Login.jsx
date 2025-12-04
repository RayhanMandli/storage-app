import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = () => {
    const BASE_URL = "http://localhost:4000";
    const [otpSent, setOtpSent] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "abcd",
        otp: "",
    });

    // serverError will hold the error message from the server
    const [serverError, setServerError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear the server error as soon as the user starts typing in either field
        if (serverError) {
            setServerError("");
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpVerified = await handleOtpVerify();
        if (!otpVerified) {
            return; // Stop the login process if OTP verification fails
        }
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                body: JSON.stringify(formData),
                credentials: "include", // Include cookies for session management
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (data.error) {
                // If there's an error, set the serverError message
                setServerError(data.error);
            } else {
                // On success, navigate to home or any other protected route
                navigate("/directory");
            }
        } catch (error) {
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
    // If there's an error, we'll add "input-error" class to both fields
    const hasError = Boolean(serverError);

    return (
        <div className="container">
            <h2 className="heading">Login</h2>
            <form className="form" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email" className="label">
                        Email
                    </label>
                    <input
                        className={`input ${hasError ? "input-error" : ""}`}
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
                        className={`input ${hasError ? "input-error" : ""}`}
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                    {/* Absolutely-positioned error message below password field */}
                    {serverError && (
                        <span className="error-msg">{serverError}</span>
                    )}
                </div>

                <button type="submit" className="submit-button">
                    Login
                </button>
            </form>

            {/* Link to the register page */}
            <p className="link-text">
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

export default Login;
