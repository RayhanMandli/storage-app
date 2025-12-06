import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const SetPassword = () => {
    const BASE_URL = "http://localhost:4000";
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear errors when user starts typing
        if (errors[name] || serverError) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
            setServerError("");
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/user/set-password`, {
                method: "POST",
                body: JSON.stringify({ password: formData.password }),
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.error) {
                setServerError(data.error);
            } else {
                // On success, show message and redirect
                setSuccessMessage("Password set successfully!");
                setTimeout(() => {
                    navigate("/directory");
                }, 2000);
            }
        } catch (error) {
            console.error("Error:", error);
            setServerError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="container">
            <h2 className="heading">Set Your Password</h2>
            <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
                Create a password to secure your account
            </p>

            <form className="form" onSubmit={handleSubmit}>
                {/* Password Field */}
                <div className="form-group">
                    <label htmlFor="password" className="label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? "input input-error" : "input"}
                        placeholder="Enter your password"
                    />
                    {errors.password && (
                        <span className="error-msg">{errors.password}</span>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="label">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? "input input-error" : "input"}
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                        <span className="error-msg">{errors.confirmPassword}</span>
                    )}
                </div>

                {/* Server Error */}
                {serverError && (
                    <div style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
                        {serverError}
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div style={{ color: "green", marginBottom: "10px", textAlign: "center" }}>
                        {successMessage}
                    </div>
                )}

                {/* Submit Button */}
                <button type="submit" className="submit-button">
                    Set Password
                </button>
            </form>
        </div>
    );
};

export default SetPassword;
