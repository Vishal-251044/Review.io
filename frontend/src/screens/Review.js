import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import "./Review.css";

const Review = () => {
    const { reviewId } = useParams();
    const [reviewData, setReviewData] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", reviewText: "" });
    const [loading, setLoading] = useState(false);
    const [expired, setExpired] = useState(false);

    const toastShown = useRef(false);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const response = await axios.get(`https://review-nlp.onrender.com/api/review/${reviewId}`);
                console.log("Fetched review data:", response.data);
                setReviewData(response.data);
            } catch (error) {
                setExpired(true);
                if (!toastShown.current) {
                    toast.error("Review link is expired or invalid.");
                    toastShown.current = true;
                }
            }
        };
        fetchReview();
    }, [reviewId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`https://review-nlp.onrender.com/api/review/submit/${reviewId}`, formData);
            toast.success("Review submitted successfully!");
            setFormData({ name: "", email: "", reviewText: "" });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to submit review.");
            }
        }
        setLoading(false);
    };

    if (expired) {
        return (
            <div className="review-container">
                <h2 className="expired-heading">Review Link Expired</h2>
                <p className="expired-message">This event review link is no longer available.</p>
                <Footer />
            </div>
        );
    }

    return reviewData ? (
        <>
            <div className="review-container">
                <h2 className="event-title">{reviewData.eventName}</h2>
                <p className="event-description"><strong>Event Description:</strong> {reviewData.eventDescription}</p>
                <p className="event-creator">
                    <strong>Created by:</strong> {reviewData?.userName || "Unknown"} ({reviewData?.userEmail || "Unknown"})
                </p>

                {/* Public Review Form */}
                <form className="review-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="review-input"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        className="review-input"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <textarea
                        className="review-textarea"
                        placeholder="Your Review"
                        value={formData.reviewText}
                        onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                        required
                    />
                    <button type="submit" className="review-btn" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
            <Footer />
        </>
    ) : (
        <div className="loading-container">
            <p className="loading-text">Loading...</p>
        </div>
    );
};

export default Review;
