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
            const res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
                email,
                password,
            });
            
            localStorage.setItem("token", res.data.token);
            console.log("Login success");
            navigate("/"); // Redirect after successful login
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
                <button className="login-button" type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="login-footer">
                <p>Don't have an account? <Link to="/register">Register Now </Link></p>
            </div>
            <p className="signup-text">
              Don't have an account? <a href="/signup">Create one</a>
            </p>
        </div>
    );
}

export default Login;
