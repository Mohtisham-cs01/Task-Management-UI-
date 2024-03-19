

import React, { useRef, useState } from 'react';
import '../style/login.css';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    let baseUrl = "http://localhost:3000";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value.trim();

        // Validation
        const validationErrors = {};
        if (!email || !password) {
            validationErrors.email = 'Email and password are required.';
        }
        if (!validateEmail(email)) {
            validationErrors.email = 'Invalid email format.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(baseUrl + '/login', {
                email,
                password
            });

            console.log('Login successful:', res.data.user);
            console.log('Login successful:', res.data.token);
            login(res.data.token, res.data.user);
        } catch (error) {
            console.log(error.response.data.error);
            console.log(error.response.status);
            toast.error(`Login failed. ${error.response.data.error} : ${error.response.status}`);
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        // Regular expression for validating email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="login-form" id='loginForm'>
                    <div className="form-group">
                        <input placeholder='Email' type="email" id="email" name="email" ref={emailRef} />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <input placeholder='Password' type="password" id="password" name="password" ref={passwordRef} />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    <button type="submit" className="btn-login" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
