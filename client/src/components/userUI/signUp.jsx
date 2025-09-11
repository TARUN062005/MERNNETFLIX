import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // user | admin
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(""); // success | error
  const [loading, setLoading] = useState(false); // loading state

  const navigate = useNavigate();

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Redirect to signin page on successful registration
  useEffect(() => {
    if (status === "success") {
      navigate("/signin");
    }
  }, [status, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url =
      role === "admin"
        ? "http://localhost:8060/admin/register"
        : "http://localhost:8060/user/register";

    try {
      const res = await axios.post(url, { name, email, password });

      setMessage(res.data.message || "Account created successfully!");
      setStatus("success");

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
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
        {/* Header with Netflix Logo */}
        <div className="relative p-6">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix Logo"
          className="w-58 h-auto cursor-pointer relative rigth-10 left-15" 
          onClick={() => navigate("/")}
        />
      </div>

        {/* SignUp Form */}
        <div className="flex-grow flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-black/75 backdrop-blur-md p-10 rounded-lg max-w-md w-[90%] text-white border border-white/30 shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

            {/* Name */}
            <input
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 p-4 rounded bg-black/40 border border-white/40 text-white placeholder-white focus:border-red-500 outline-none"
              required
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 p-4 rounded bg-black/40 border border-white/40 text-white placeholder-white focus:border-red-500 outline-none"
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-4 p-4 rounded bg-black/40 border border-white/40 text-white placeholder-white focus:border-red-500 outline-none"
              required
            />

            {/* Role Selection */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mb-6 p-4 rounded bg-black/40 border border-white/40 text-white focus:border-red-500 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Message Alert */}
            {message && (
              <div
                className={`mb-6 p-3 rounded-lg text-center font-semibold transition-all ${
                  status === "success"
                    ? "bg-green-500 text-black"
                    : "bg-red-500 text-white"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-500 cursor-not-allowed" : "bg-red-600"
              } hover:bg-red-700 text-white font-bold py-3 rounded text-lg border-2 border-transparent hover:border-white transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Back link */}
            <p className="text-center mt-6 text-gray-300">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-white font-semibold hover:underline hover:font-bold hover:text-red-500"
              >
                Sign in
              </Link>
            </p>
            <p className="text-center mt-4">
              <Link
                to="/"
                className="text-gray-400 hover:text-white hover:underline"
              >
                ← Back to Home
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
