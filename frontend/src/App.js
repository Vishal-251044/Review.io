import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import Review from "./screens/Review";

import "./App.css";

function App() {
  useEffect(() => {
    // 🚫 Prevent zooming via keyboard shortcuts
    const disableZoomKeys = (event) => {
      if ((event.ctrlKey || event.metaKey) && ["+", "-", "0"].includes(event.key)) {
        event.preventDefault();
      }
    };

    // 🚫 Prevent zooming via Ctrl + Mouse Wheel Scroll
    const disableWheelZoom = (event) => {
      if (event.ctrlKey) event.preventDefault();
    };

    // 🚫 Prevent pinch zoom on touch devices
    const disableTouchZoom = (event) => {
      if (event.touches.length > 1) event.preventDefault();
    };

    document.addEventListener("keydown", disableZoomKeys);
    document.addEventListener("wheel", disableWheelZoom, { passive: false });
    document.addEventListener("touchmove", disableTouchZoom, { passive: false });

    return () => {
      document.removeEventListener("keydown", disableZoomKeys);
      document.removeEventListener("wheel", disableWheelZoom);
      document.removeEventListener("touchmove", disableTouchZoom);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Global Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/review/:reviewId" element={<Review />} />
        </Routes>
      </div>

      {/* ✅ Toastify for global notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
