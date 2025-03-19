import React from 'react';
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-logo">Review.NLP</div>
            <div className="footer-text">Review.NLP creates a platform for public review submissions. Utilizing NLP, it determines whether feedback is positive or negative and assesses the project's overall success based on the analyzed reviews.</div>
            <div className="footer-rights">© 2025 Review.NLP. All rights reserved.</div>
        </footer>
    );
};

export default Footer;