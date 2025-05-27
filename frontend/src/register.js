import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './styling/register.css';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (e) => {

        e.preventDefault();
        try {
            const res = await axios.post("http://127.0.0.1:5000/api/auth/register", {
                name,
                email,
                password,
            });

            console.log("Registration successful:", res.data);
            navigate("/login");
        } catch (err) {
            console.error("Registration failed:", err);
            setError("Registration failed. Please check your info.");
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={name}
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
                {/* Mensaje debajo del campo de contraseña */}
                <p style={{ fontSize: "12px", color: "#888" }}>Password must be at least 8 characters</p>
                <button type="submit">Register Now</button> {/* Cambié el texto aquí */}
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Register;
