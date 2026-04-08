import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SetPassword = () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
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

    const labelBase = "block text-sm font-semibold text-gray-800 mb-1";
    const inputBase = (hasError = false) =>
        `w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasError ? "border-red-500" : "border-gray-300"}`;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Set Your Password</h2>
                <p className="text-center text-sm text-gray-600">
                    Create a password to secure your account
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label htmlFor="password" className={labelBase}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputBase(Boolean(errors.password))}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-xs text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="confirmPassword" className={labelBase}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={inputBase(Boolean(errors.confirmPassword))}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {serverError && (
                        <div className="text-center text-sm text-red-600">{serverError}</div>
                    )}

                    {successMessage && (
                        <div className="text-center text-sm text-green-600">{successMessage}</div>
                    )}

                    <button type="submit" className="h-10 w-full rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPassword;
