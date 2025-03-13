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
                <li>
                <a href="#">About</a>
                </li>
                <li>
                    <a href="#">Contact Us</a>
                </li>
                <li>
                    <button className="login-btn">Login</button>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
