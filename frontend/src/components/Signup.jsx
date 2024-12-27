import React, { useState } from 'react';
import './Auth.css'; // Assuming CSS is in the same folder
import { signup } from '../api'; // Assuming the signup API is defined in 'api.js'

const Signup = () => {
    // State to store form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            return alert('Passwords do not match');
        }

        try {
            // Send signup data to API
            const response = await signup(formData);
            alert(response.data.message);  // Show success message
        } catch (error) {
            alert(error.response?.data?.error || 'Error signing up');  // Show error message
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
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
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="confirm password"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Signup</button>
                    <div className="register-link">
                        <p>Already have an account? <a href="/signin">Signin</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
