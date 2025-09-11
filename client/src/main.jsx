// client/src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainContent from "./components/common/mainContent.jsx";
import SignIn from "./components/userUI/signIn.jsx";
import SignUp from "./components/userUI/signUP.jsx";
import About from "./components/common/about.jsx";
import Header from "./components/common/header.jsx";
import Contact from "./components/common/contact.jsx";
import UserDashboard from "./components/userUI/userDashboard.jsx";
import AdminDashboard from "./components/adminUI/adminDashboard.jsx";
import "./main.css";

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

