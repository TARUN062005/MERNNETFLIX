import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(""); // success | error
  const [loading, setLoading] = useState(false); // NEW: loading state
  const navigate = useNavigate();

  // Effect to automatically clear the message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setStatus("");
      }, 3000); // auto dismiss in 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double click
    setLoading(true); // start loading

    const url =
      role === "admin"
        ? "http://localhost:8060/admin/login"
        : "http://localhost:8060/user/login";

    try {
      const res = await axios.post(url, { email, password });

      setMessage(res.data.message || "Login Successful");
      setStatus("success");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed, please try again."
      );
      setStatus("error");
    } finally {
      setLoading(false); // stop loading after response
    }
  };

  return (
    <div className="relative w-full h-screen font-inter">
      <img
        src="https://xboxwire.thesourcemediaassets.com/sites/2/2023/05/Background-size1920x1080-4e1694a6-75aa-4c36-9d4d-7fb6a3102005-bc5318781aad7f5c8520.png"
        alt="background"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />

      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between z-30">
        {/* Netflix Logo */}
        <div className="flex justify-between items-center p-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix Logo"
            className="w-58 h-auto cursor-pointer relative rigth-10 left-15"
            onClick={() => navigate("/")} // go to home page
          />
        </div>

        {/* Form */}
        <div className="flex-grow flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-black/80 backdrop-blur-md p-12 rounded-lg max-w-md w-[90%] sm:w-[420px] text-white border border-white/20 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Sign In</h2>

            {/* Email */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className="w-full mb-5 p-4 rounded bg-black/50 border border-white/30 text-white placeholder-gray-300 focus:border-red-500 outline-none"
              required
            />

            {/* Password */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-3 p-4 rounded bg-black/50 border border-white/30 text-white placeholder-gray-300 focus:border-red-500 outline-none"
              required
            />

            {/* Role Selector */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mb-6 p-3 rounded bg-black/50 border border-white/30 text-white focus:border-red-500 outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* Alert Message */}
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
              className={`w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded text-lg border-2 border-transparent transition-all duration-300 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:border-white hover:shadow-lg hover:scale-105"
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign up link */}
            <p className="text-center mt-8 text-gray-300">
              New here?{" "}
              <Link
                to="/signup"
                className="text-white font-semibold hover:underline hover:font-bold hover:text-red-500 transition-all cursor-pointer"
              >
                Sign up now
              </Link>
            </p>

            {/* Back link */}
            <p className="text-center mt-4">
              <Link
                to="/"
                className="text-gray-400 hover:text-red-500 hover:underline transition-all"
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
