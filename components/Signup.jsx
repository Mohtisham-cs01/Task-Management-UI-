
import React, { useRef, useState } from 'react';
import axios from 'axios';
import '../style/signup.css';
import { useAuth } from '../context/authContext';

const Signup = () => {
    const emailRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const  { login } = useAuth();
   

    const baseUrl = "http://localhost:3000";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value.trim();
        const username = usernameRef.current.value.trim();
        const password = passwordRef.current.value.trim();
        const confirmPassword = confirmPasswordRef.current.value.trim();

        // Validation
        const validationErrors = {};
        if (!validateEmail(email)) {
            validationErrors.email = 'Invalid email format.';
        }
        if (username.length < 4 || username.length > 20) {
            validationErrors.username = 'Username must be between 4 and 20 characters.';
        }
        if (!validatePassword(password)) {
            validationErrors.password = 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number.';
        }
        if (password !== confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(baseUrl + '/signup', {
                email,
                username,
                password
            });
            console.log('Signup successful:', res.data.user);
            console.log('Signup successful:', res.data.token);
            // Optionally, redirect the user to the login page after successful signup
            login(res.data.token, res.data.user);

        } catch (error) {
            console.error('Signup error:', error);
            // Handle server error
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        // Basic email format validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        // Password validation: at least 8 characters, one lowercase letter, one uppercase letter, and one number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    };

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit} className="signup-form" id='signupForm'>
                    <div className="form-group">
                        <input placeholder='Email' type="email" id="email" name="email" ref={emailRef} />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <input placeholder='Username' type="text" id="username" name="username" ref={usernameRef} />
                        {errors.username && <span className="error">{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <input placeholder='Password' type="password" id="password" name="password" ref={passwordRef} />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <input placeholder='Confirm Password' type="password" id="confirmPassword" name="confirmPassword" ref={confirmPasswordRef} />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>
                    <button type="submit" className="btn-signup" disabled={loading}>{loading ? 'Signing up...' : 'Signup'}</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
