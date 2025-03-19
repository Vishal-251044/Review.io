import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSignOutAlt, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedReviews, setSelectedReviews] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchUserReviews(userData.email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out successfully!");
  };

  const handleUpdate = async () => {
    try {
      if (!updatedName && !updatedPassword) return;

      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        "https://review-nlp.onrender.com/update/profile",
        { name: updatedName, password: updatedPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      setUpdatedName("");
      setUpdatedPassword("");
      setShowEditModal(false);

      toast.success(data.message || "Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const fetchUserReviews = async (email) => {
    try {
      setLoadingEvents(true);
      const { data } = await axios.get(
        `https://review-nlp.onrender.com/profile/reviews?email=${email}`
      );
      setEvents(data);
    } catch (error) {
      toast.error("Error fetching your events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm("You want to delete event results?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`https://review-nlp.onrender.com/delete/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((event) => event._id !== eventId));
      toast.success("Event deleted successfully!");
    } catch (error) {
      toast.error("Error deleting the event.");
    }
  };

  const handleShowResult = async (eventId) => {
    try {
      const { data } = await axios.get(`https://review-nlp.onrender.com/nlp/analyze/${eventId}`);
      setAnalysisResult(data);
    } catch (error) {
      toast.error("Error fetching result analysis.");
    }
  };

  return (
    <div className="profile">
      <div className="profile__back" onClick={() => navigate("/")}>
        <FaArrowLeft />
      </div>

      <div className="profile__content">
        <div className="profile__edit" onClick={() => setShowEditModal(true)}>
          <FaEdit />
        </div>

        <div className="profile__icon">{user?.name?.charAt(0).toUpperCase()}</div>
        <h2 className="profile__name">{user?.name}</h2>
        <p className="profile__email">{user?.email}</p>

        <button className="profile__logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {showEditModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <button className="close-btn" onClick={() => setShowEditModal(false)}>
              Close
            </button>
            <h3 className="edit-modal-title">Edit Profile</h3>
            <input
              type="text"
              className="edit-input"
              placeholder="Update Name"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <input
              type="password"
              className="edit-input"
              placeholder="Update Password"
              value={updatedPassword}
              onChange={(e) => setUpdatedPassword(e.target.value)}
            />
            <button className="update-btn" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      )}

      <div className="event-container">
        <h2 className="event-title-head">Your Events</h2>
        {loadingEvents ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-box">
              <div className="event-details">
                <h3>{event.eventName}</h3>
                <p>{event.eventDescription}</p>
                <p>{new Date(event.createdAt).toLocaleString()}</p>
                <p className="review-count">Reviews: {event.reviews.length}</p>
              </div>
              <div className="event-actions">
                <button onClick={() => setSelectedReviews(event.reviews)}>
                  See Reviews
                </button>
                <button onClick={() => handleShowResult(event._id)}>Result</button>
              </div>
              <FaTrash className="delete-icon" onClick={() => handleDeleteEvent(event._id)} />
            </div>
          ))
        )}
      </div>;

      {analysisResult && (
        <div className="result-modal">
          <div className="result-modal-content">
            <button className="close-btn" onClick={() => setAnalysisResult(null)}>Close</button>
            <h3>Analysis Result</h3>

            <p>Positive Reviews: {analysisResult.positivePercent}%</p>
            <p>Negative Reviews: {analysisResult.negativePercent}%</p>
            <p>Mixed Reviews: {analysisResult.mixedPercent}%</p>

            {/* Success percentage with emoji */}
            <p>
              Event Success: {analysisResult.successPercent}%{" "}
              {analysisResult.successPercent <= 25 ? "😢" :
                analysisResult.successPercent <= 50 ? "😔" :
                  analysisResult.successPercent <= 75 ? "😊" : "😁"}
            </p>

            <p className={`rating ${analysisResult.rating > 4 ? "highlight-rating" : ""}`}>
              Rating: {analysisResult.rating} / 5{" "}
              {analysisResult.rating > 4 ? "🌸✨" : ""}
            </p>
          </div>
        </div>
      )}

      {selectedReviews && (
        <div className="review-modal">
          <div className="review-modal-content">
            <h3>Reviews</h3>
            {selectedReviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              selectedReviews.map((review, index) => (
                <div key={index} className="review-item">
                  <p><strong>{review.name}</strong> ({review.email})</p>
                  <p>{review.reviewText}</p>
                  <p>{new Date(review.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
            <button className="close-btn" onClick={() => setSelectedReviews(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;
