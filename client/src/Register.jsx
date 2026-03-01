import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
    const BASE_URL = "http://localhost:4000";

    const [formData, setFormData] = useState({
        name: " Mandli",
        email: "",
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
                    navigate("/directory");
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
                navigate("/directory");
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

    const inputBase = (hasError = false) =>
        `w-full rounded-lg border px-4 py-3 text-sm bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition ${hasError ? "border-red-500" : "border-gray-700"}`;
    const labelBase = "block text-sm font-semibold text-gray-300 mb-2";
    const primaryBtn = `h-12 px-4 rounded-lg ${isSuccess ? "bg-green-600" : "bg-white text-black"} text-sm font-semibold hover:opacity-90 transition w-full`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400 font-light">Get started with G Drive Express</p>
                </div>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label htmlFor="name" className={labelBase}>
                            Name
                        </label>
                        <input
                            className={inputBase()}
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="relative space-y-1">
                        <label htmlFor="email" className={labelBase}>
                            Email
                        </label>
                        <input
                            className={inputBase(Boolean(serverError))}
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
                            className="absolute right-0  h-11 px-4 rounded-lg bg-gray-200 text-black text-xs font-semibold hover:bg-gray-600 transition"
                            onClick={() => {
                                setOtpSent(true);
                                handleOtpSent();
                            }}
                        >
                            Send OTP
                        </button>
                        {serverError && (
                            <p className="text-xs text-red-400 mt-1">{serverError}</p>
                        )}
                    </div>

                    {otpSent && (
                        <div className="space-y-1">
                            <label htmlFor="otp" className={labelBase}>
                                OTP
                            </label>
                            <input
                                className={inputBase(Boolean(serverError))}
                                type="text"
                                id="otp"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                placeholder="Enter your OTP"
                                required
                            />
                            {serverError && (
                                <p className="text-xs text-red-400 mt-1">{serverError}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label htmlFor="password" className={labelBase}>
                            Password
                        </label>
                        <input
                            className={inputBase()}
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
                        className={primaryBtn}
                    >
                        {isSuccess ? "Registration Successful" : "Register"}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-800/30 text-gray-400 font-light">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={(credentialResponse) => {
                                handleGoogleLogin(credentialResponse);
                            }}
                            onError={() => {
                                console.log("Login Failed");
                            }}
                            useOneTap
                            theme="filled_black"
                        />
                    </div>
                    <a
                        className="flex items-center justify-center gap-2 w-full h-12 px-4 rounded-lg border border-gray-700 bg-gray-800/50 text-sm font-semibold text-white hover:bg-gray-700 transition"
                        href="https://github.com/login/oauth/authorize?client_id=Ov23li5iOPKgLejYkQuQ&scope=read:user user:email&redirect_uri=http://localhost:4000/auth/github/callback"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Continue with GitHub
                    </a>
                </div>

                <p className="text-sm text-center text-gray-400 font-light">
                    Already have an account?{" "}
                    <Link className="font-semibold text-white hover:underline" to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
