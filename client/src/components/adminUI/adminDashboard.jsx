// client/src/components/adminUI/adminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token || storedUser.role !== "admin") {
      navigate("/signin"); // redirect if not admin
      return;
    }

    setAdmin(storedUser);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-3xl font-bold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-inter">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">
        You are logged in as{" "}
        <span className="text-red-500">{admin?.name || "Admin"}</span>
      </h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-all duration-300"
      >
        Log Out
      </button>
    </div>
  );
}
