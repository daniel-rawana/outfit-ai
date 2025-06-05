import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './styling/register.css';

function Register() {
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (e) => {

        e.preventDefault();
        try {
            const res = await axios.post("https://outfit-api.ddns.net.jumpingcrab.com/users/register", {
                username,
                email,
                password,
            });

            console.log("Registration successful:", res.data);
            alert("Registration successful! Check your email to activate your account.");
            navigate("/login");
        } catch (err) {
            console.error("Registration failed:", err);
            if (err.response && err.response.status === 409) {
                setError("This email is already registered. Please use a different email. Or login if you already have an account.");
            }
            setError("Registration failed. Please check your information.");
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                {/* Message under password */}
                <p style={{ fontSize: "12px", color: "#888" }}>Password must be at least 8 characters</p>
                <button type="submit">Register Now</button> {/* Register */}
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Register;
