import React, { useState } from 'react';
import './Auth.css'; // Reusing the same CSS file for consistency
import { signin } from '../api'; // Assuming the signin API is defined in 'api.js'
import { useNavigate } from 'react-router-dom';


const Signin = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send signin data to API
            const response = await signin(formData);
            
            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', response.data.email);
            navigate('/home');
            alert('Login successful');

        } catch (error) {
            alert(error.response?.data?.error || 'Error signing in');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Signin</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Signin</button>
                    <div className="register-link">
                        <p>Don't have an account? <a href="/signup">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signin;
