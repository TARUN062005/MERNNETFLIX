import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // user | admin
  const [otp, setOtp] = useState(""); // OTP input
  const [isOtpSent, setIsOtpSent] = useState(false); // toggle form step
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Redirect after success
  useEffect(() => {
    if (status === "success" && !isOtpSent) {
      navigate("/signin");
    }
  }, [status, isOtpSent, navigate]);

  // Step 1: Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8060/send-otp", {
        name,
        email,
        password,
        role,
      });

      setMessage(res.data.message || "OTP sent to your email.");
      setStatus("success");
      setIsOtpSent(true); // switch to OTP form
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8060/verify-otp", {
        email,
        otp,
      });

      setMessage(res.data.message || "Account created successfully!");
      setStatus("success");

      // Clear fields
      setName("");
      setEmail("");
      setPassword("");
      setOtp("");
      setIsOtpSent(false);

      navigate("/signin");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP. Try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen font-inter">
      {/* Background */}
      <img
        src="src/assets/netflix-bg.png"
        alt="background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />

      {/* Content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col z-30">
        {/* Logo */}
        <div className="relative p-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix Logo"
            className="w-58 h-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Form */}
        <div className="flex-grow flex items-center justify-center">
          {!isOtpSent ? (
            /* Step 1: Signup Form */
            <form
              onSubmit={handleSubmit}
              className="bg-black/75 p-10 rounded-lg max-w-md w-[90%] text-white border border-white/30 shadow-xl"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 p-4 rounded bg-black/40 border border-white/40"
                required
              />

              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 p-4 rounded bg-black/40 border border-white/40"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 p-4 rounded bg-black/40 border border-white/40"
                required
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mb-6 p-4 rounded bg-black/40 border border-white/40"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              {message && (
                <div
                  className={`mb-6 p-3 rounded-lg text-center font-semibold ${
                    status === "success"
                      ? "bg-green-500 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded text-lg flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form
              onSubmit={handleVerifyOtp}
              className="bg-black/75 p-10 rounded-lg max-w-md w-[90%] text-white border border-white/30 shadow-xl"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Verify Email</h2>
              <p className="text-gray-300 mb-4 text-center">
                We’ve sent a verification code to <b>{email}</b>
              </p>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mb-6 p-4 rounded bg-black/40 border border-white/40"
                required
              />

              {message && (
                <div
                  className={`mb-6 p-3 rounded-lg text-center font-semibold ${
                    status === "success"
                      ? "bg-green-500 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded text-lg flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
