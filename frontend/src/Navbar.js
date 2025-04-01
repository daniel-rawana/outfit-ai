import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "./assets/icons";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <Icons.Logo className="logo-icon"/> RunwAI
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
