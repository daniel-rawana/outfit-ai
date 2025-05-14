import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from './assets/runwai_logo.png';

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <img src={logo} className="logo-icon" alt="Logo" /> RunwAI
            </Link>
            <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/saved-outfits">Saved Outfits</Link></li> 
                <li>
                    <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
