import React from "react";
import { Link } from "react-router-dom";
import logo from './assets/runwai_logo.png';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <img src={logo} className="logo-icon"/> RunwAI
            </div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li>
                    <button className="login-btn">Login</button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
