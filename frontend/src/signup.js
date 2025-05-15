import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './styling/login.css';

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post("http://127.0.0.1:5000/api/auth/signup", {
                email,
                password,
            });

            console.log("Signup success");
            navigate("/login");
        } catch (err) {
            setError("Signup failed. Please try again.");
            console.error("Signup error:", err);
        }
    };

    return (
        <div className="login-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button className="login-button" type="submit">Create Account</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <p className="signup-text">
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}

export default Signup;
