import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
            try {
                JSON.parse(storedUser);
                navigate("/");
            } catch (error) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const url = isSignup 
                ? "https://review-nlp.onrender.com/auth/register" 
                : "https://review-nlp.onrender.com/auth/login";
    
            const { data } = await axios.post(url, formData);
    
            if (data.error) {
                toast.error(data.error);
            } else {
                if (data.user && data.token) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    localStorage.setItem("token", data.token);
                    toast.success(isSignup ? "Account created successfully!" : "Login successful!");
                    navigate("/");
                } else {
                    toast.error("Invalid response from server.");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-container">
            <button className="back-button" onClick={() => navigate('/')}>
                <FaArrowLeft />
            </button>

            <div className="login-box">
                <h2>{isSignup ? 'Create Account' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Login'}
                    </button>
                </form>
                <p>
                    {isSignup ? (
                        <span onClick={() => setIsSignup(false)}>
                            <FaArrowLeft /> Back to Login
                        </span>
                    ) : (
                        <span onClick={() => setIsSignup(true)}>
                            Create an Account <FaArrowRight />
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default Login;
