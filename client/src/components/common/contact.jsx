import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [alert, setAlert] = useState({ message: null, status: "" });

  // Automatically clear the alert message after 3 seconds
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: null, status: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate a successful form submission
    console.log("Form Submitted:", formData);
    setAlert({
      message: "Thank you! Your message has been sent.",
      status: "success",
    });

    // Clear the form fields after submission
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white p-6 font-inter overflow-hidden">
      {/* Background Image */}
      <img
        src="src/assets/netflix-bg.png"
        alt="Contact background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />

      {/* Content */}
      <div className="relative z-30 flex flex-col items-center justify-center max-w-4xl text-center p-4 sm:p-8 md:p-12 bg-black/50 rounded-lg shadow-2xl backdrop-blur-md border border-white/20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Contact Us
        </h1>
        
        <hr className="w-16 h-1 my-6 bg-red-600 border-none rounded-full" />

        <p className="max-w-xl text-lg md:text-xl font-light leading-relaxed mb-6">
          Have questions, feedback, or partnership ideas? We’d love to hear from you. Fill out the form below and we’ll get back to you soon.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
          {alert.message && (
            <div
              className={`p-3 rounded-lg font-semibold text-center ${
                alert.status === "success"
                  ? "bg-green-500 text-black"
                  : "bg-red-500 text-white"
              }`}
            >
              {alert.message}
            </div>
          )}
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded bg-white/10 text-white placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded bg-white/10 text-white placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded bg-white/10 text-white placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Send Message
          </button>
        </form>

        <Link
          to="/"
          className="mt-10 inline-block bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
