import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from './assets/runwai_logo.png';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    
    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        
        // Update state
        setIsLoggedIn(false);
        setShowDropdown(false);
        
        // Redirect to login page
        alert("You have been logged out successfully.");
        console.log("User logged out"); 
        navigate("/login");
    };

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
                    {isLoggedIn ? (
                        <div className="user-menu" ref={dropdownRef}>
                            <button 
                                className="user-menu-btn" 
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                [Username]
                            </button>
                            
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;