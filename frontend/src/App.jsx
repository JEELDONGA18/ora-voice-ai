import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import VoiceApp from "./pages/VoiceApp.jsx";
import About from "./pages/About.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/talk" element={<VoiceApp />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}