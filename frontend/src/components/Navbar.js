import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; 
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Invalid JSON in localStorage, clearing storage.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    };

    updateUser();

    window.addEventListener("storage", updateUser);

    return () => window.removeEventListener("storage", updateUser);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">Review.NLP</div>

      {/* Login Button / Profile Icon */}
      {user ? (
        <FaUserCircle className="profile-icon" onClick={() => navigate("/profile")} />
      ) : (
        <button className="login-button" onClick={() => navigate("/login")}>
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
