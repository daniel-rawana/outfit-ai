import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import GeneratedOutfit from "./GeneratedOutfit";
import Preferences from "./Preferences";
import AboutUs from "./about-us";
import ContactUs from "./contact-us";

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
            </Routes>
        </Router>
    );
}

export default App;
