import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import './styling/login.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://outfit-api.ddns.net.jumpingcrab.com/users/login", {
                email,
                password,
            });

            console.log("Login response:", res.data); // Log the entire response
            
            // Store token and user ID correctly
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("userId", res.data.user_id);
            
            console.log("Token stored:", localStorage.getItem("token"));
            console.log("User ID stored:", localStorage.getItem("userId"));
            
            // Dispatch event to notify navbar
            window.dispatchEvent(new Event('storage'));
            
            console.log("Login success");
            navigate("/"); // Redirect after successful login
        } catch (err) {
            console.error("Login error details:", err.response ? err.response.data : err.message);
            setError("Invalid email or password.");
        }
    };
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="login-footer">
                <p> Don't have an account? <Link to="/register">Register Now </Link></p>
            </div>
        </div>
    );
}


export default Login;

