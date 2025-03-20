import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import axios from "axios";
import "./PasswordReset.css";

export default function PasswordReset() {
    const tabData = [
        { id: 1, tabName: "Student", type: "Student" },
        { id: 2, tabName: "Tutor", type: "Tutor" },
    ];

    const [field, setField] = useState("Student");
    const [step, setStep] = useState(1); // 1: Email/Phone entry, 2: Verification, 3: New Password
    const [verificationMethod, setVerificationMethod] = useState("email");
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMethodChange = (method) => {
        setVerificationMethod(method);
    };

    const handleRequestVerification = async (e) => {
        e.preventDefault();

        // Validate form data
        if (verificationMethod === "email" && !formData.email) {
            setError("Email is required.");
            return;
        }

        if (verificationMethod === "phone" && !formData.phone) {
            setError("Phone number is required.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // API call to request verification code
            const response = await axios.post(
                "http://localhost:4000/api/v1/auth/request-reset",
                {
                    accountType: field,
                    method: verificationMethod,
                    email: formData.email,
                    phone: formData.phone,
                }
            );

            setSuccessMessage(`Verification code sent to your ${verificationMethod}. Please check and enter the code.`);
            setTimeout(() => {
                setSuccessMessage(null);
                setStep(2);
            }, 3000);
        } catch (err) {
            console.error("Error requesting verification:", err);
            const errorMessage = err.response?.data?.message || `Failed to send verification code to ${verificationMethod}.`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        if (!formData.verificationCode) {
            setError("Verification code is required.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // API call to verify code
            const response = await axios.post(
                "http://localhost:4000/api/v1/auth/verify-reset-code",
                {
                    accountType: field,
                    method: verificationMethod,
                    email: formData.email,
                    phone: formData.phone,
                    code: formData.verificationCode,
                }
            );

            setSuccessMessage("Verification successful. Please set your new password.");
            setTimeout(() => {
                setSuccessMessage(null);
                setStep(3);
            }, 3000);
        } catch (err) {
            console.error("Error verifying code:", err);
            const errorMessage = err.response?.data?.message || "Invalid verification code.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!formData.newPassword || !formData.confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // API call to reset password
            const response = await axios.post(
                "http://localhost:4000/api/v1/auth/reset-password",
                {
                    accountType: field,
                    method: verificationMethod,
                    email: formData.email,
                    phone: formData.phone,
                    code: formData.verificationCode,
                    newPassword: formData.newPassword,
                }
            );

            setSuccessMessage("Password reset successful! Redirecting to login...");
            setTimeout(() => {
                setSuccessMessage(null);
                navigate("/login");
            }, 3000);
        } catch (err) {
            console.error("Error resetting password:", err);
            const errorMessage = err.response?.data?.message || "Failed to reset password.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r">
                <div className="w-full max-w-lg bg-richblack-800 p-8 rounded-xl shadow-xl hover:shadow-2xl duration-500 mt-20">
                    <h1 className="text-3xl font-semibold mb-8 text-center text-richblack-5">
                        Reset Password
                    </h1>

                    <div className="relative flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max">
                        {tabData.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setField(tab.type)}
                                className={`py-2 px-5 rounded-lg transition-all duration-200 text-lg font-semibold ${
                                    field === tab.type ? "bg-yellow-400 text-black" : "bg-transparent text-white"
                                }`}
                            >
                                {tab?.tabName}
                            </button>
                        ))}
                    </div>

                    {successMessage && (
                        <div className="bg-green-500 text-white p-3 rounded-md mb-4">
                            {successMessage}
                        </div>
                    )}

                    {step === 1 && (
                        <form className="flex w-full flex-col gap-y-4" onSubmit={handleRequestVerification}>
                            <div className="flex gap-x-4 mb-4">
                                <button
                                    type="button"
                                    onClick={() => handleMethodChange("email")}
                                    className={`w-1/2 py-2 px-4 rounded-lg transition-all duration-200 text-lg font-semibold ${
                                        verificationMethod === "email" ? "bg-yellow-400 text-black" : "bg-transparent text-white border border-white"
                                    }`}
                                >
                                    Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMethodChange("phone")}
                                    className={`w-1/2 py-2 px-4 rounded-lg transition-all duration-200 text-lg font-semibold ${
                                        verificationMethod === "phone" ? "bg-yellow-400 text-black" : "bg-transparent text-white border border-white"
                                    }`}
                                >
                                    Text Message
                                </button>
                            </div>

                            {verificationMethod === "email" && (
                                <label className="w-full">
                                    <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                        Email Address <sup className="text-pink-200">*</sup>
                                    </p>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-lg p-[14px] border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                    />
                                </label>
                            )}

                            {verificationMethod === "phone" && (
                                <label className="w-full">
                                    <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                        Phone Number <sup className="text-pink-200">*</sup>
                                    </p>
                                    <input
                                        required
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-lg p-[14px] border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                    />
                                </label>
                            )}

                            <button
                                type="submit"
                                className="bg-yellow-400 py-3 px-6 text-black text-lg rounded-lg font-semibold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all mt-6"
                            >
                                {loading ? "Sending..." : "Send Verification Code"}
                            </button>

                            {error && (
                                <div className="bg-red-500 text-white p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                        </form>
                    )}

                    {step === 2 && (
                        <form className="flex w-full flex-col gap-y-4" onSubmit={handleVerifyCode}>
                            <p className="text-richblack-5 mb-4">
                                Enter the verification code sent to your {verificationMethod === "email" ? formData.email : formData.phone}
                            </p>

                            <label className="w-full">
                                <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                    Verification Code <sup className="text-pink-200">*</sup>
                                </p>
                                <input
                                    required
                                    type="text"
                                    name="verificationCode"
                                    placeholder="Enter verification code"
                                    value={formData.verificationCode}
                                    onChange={handleChange}
                                    className="w-full rounded-lg p-[14px] border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                />
                            </label>

                            <div className="flex gap-x-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-1/2 bg-gray-500 py-3 px-6 text-white text-lg rounded-lg font-semibold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all mt-6"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-yellow-400 py-3 px-6 text-black text-lg rounded-lg font-semibold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all mt-6"
                                >
                                    {loading ? "Verifying..." : "Verify Code"}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500 text-white p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                        </form>
                    )}

                    {step === 3 && (
                        <form className="flex w-full flex-col gap-y-4" onSubmit={handleResetPassword}>
                            <label className="w-full">
                                <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                    New Password <sup className="text-pink-200">*</sup>
                                </p>
                                <input
                                    required
                                    type="password"
                                    name="newPassword"
                                    placeholder="Enter new password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full rounded-lg p-[14px] border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                />
                            </label>

                            <label className="w-full">
                                <p className="mb-2 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                    Confirm New Password <sup className="text-pink-200">*</sup>
                                </p>
                                <input
                                    required
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm new password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full rounded-lg p-[14px] border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                                />
                            </label>

                            <div className="flex gap-x-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-1/2 bg-gray-500 py-3 px-6 text-white text-lg rounded-lg font-semibold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all mt-6"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="w-1/2 bg-yellow-400 py-3 px-6 text-black text-lg rounded-lg font-semibold hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all mt-6"
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500 text-white p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
