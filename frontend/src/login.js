import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
            const res = await axios.post("http://127.0.0.1:5000/users/login", {
                email,
                password,
            });

            // Store token or user info as needed
            const token = localStorage.setItem("token", res.data.access_token);
            const uid = localStorage.setItem("userId", res.data.user_id);
            console.log("Token:", token);
            console.log("User ID:", uid);
            // Redirect to home page or another page after successful login
            console.log("Login success");
            navigate("/"); // or wherever you want to redirect
        } catch (err) {
            setError("Invalid email or password.");
            console.error("Login failed:", err);
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
        </div>
    );
}

export default Login;
