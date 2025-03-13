import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import GeneratedOutfit from "./GeneratedOutfit";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/generated-outfit" element={<GeneratedOutfit />} />
            </Routes>
        </Router>
    );
}

export default App;
