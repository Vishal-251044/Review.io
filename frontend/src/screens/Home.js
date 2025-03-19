import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";

const Home = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await axios.post("https://review-nlp.onrender.com/api/contact/submit", contactForm);
      toast.success(response.data.message);
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Try again.");
    }
    setLoading(false); 
  };

  const isLoggedIn = () => {
    return localStorage.getItem("user") !== null;
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      toast.error("Login first...");
      return;
    }

    setEventLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const eventData = {
      name: user.name,
      email: user.email,
      eventName,
      eventDescription,
    };

    try {
      const response = await axios.post("https://review-nlp.onrender.com/api/review/create", eventData);
      setGeneratedLink(response.data.link);
      toast.success("Event review link created!");
    } catch (error) {
      toast.error("Failed to create review link.");
    }
    setEventLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <>
      <Navbar />
      <div className="home">
        {/* Event Review Form */}
        <section className="event-form">
          <h2 className="section-title">Create Event Review Form</h2>
          <form className="form" onSubmit={handleEventSubmit}>
            <input
              type="text"
              className="input-field"
              placeholder="Enter Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
            <textarea
              className="textarea-field"
              placeholder="Enter Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="btn" disabled={eventLoading}>
              {eventLoading ? "Creating..." : "Create Link"}
            </button>
          </form>
          {/* Show Generated Link with Copy Button */}
          {generatedLink && (
            <div className="generated-link">
              <p>Review Link: <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a></p>
              <button className="copy-btn" onClick={copyToClipboard}>Copy Link</button>
            </div>
          )}
        </section>

        {/* Platform Features */}
        <section className="features">
          <h2 className="section-title">Platform Features</h2>
          <ul className="feature-list">
            <li className="feature-item">AI-powered sentiment analysis for event success</li>
            <li className="feature-item">Public review collection and sharing</li>
            <li className="feature-item">Real-time success percentage calculation</li>
            <li className="feature-item">Secure and decentralized platform</li>
          </ul>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">1. Login to your account</div>
            <div className="step">2. Create an event review form</div>
            <div className="step">3. Share the review form with others</div>
            <div className="step">4. View generated report with success percentage</div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact">
          <h2 className="section-title">Contact Us</h2>
          <form className="form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              className="input-field"
              placeholder="Your Name"
              name="name"
              value={contactForm.name}
              onChange={handleContactChange}
              required
            />
            <input
              type="email"
              className="input-field"
              placeholder="Your Email"
              name="email"
              value={contactForm.email}
              onChange={handleContactChange}
              required
            />
            <textarea
              className="textarea-field"
              placeholder="Your Message"
              name="message"
              value={contactForm.message}
              onChange={handleContactChange}
              required
            ></textarea>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
