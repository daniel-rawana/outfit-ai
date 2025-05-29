import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./navbar";
import HomePage from "./home-page";
import GeneratedOutfit from "./generated-outfit";
import Preferences from "./preferences";
import AboutUs from "./about-us.js";
import ContactUs from "./contact-us.js";
import SavedOutfits from "./saved-outfits";
import Login from "./login";
import Register from "./register";
function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/generated-outfit" element={<GeneratedOutfit />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/saved-outfits" element={<SavedOutfits />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}
export default App;
