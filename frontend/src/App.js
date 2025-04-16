import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./navbar";
import HomePage from "./home-page";
import GeneratedOutfit from "./generated-outfit";
import Preferences from "./preferences";
import AboutUs from "./about-us.js";
import ContactUs from "./contact-us.js";
import SavedOutfits from "./saved-outfits";

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
            </Routes>
        </Router>
    );
}
export default App;
