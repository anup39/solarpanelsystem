import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MapSection from "../pages/MapSection";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/map" element={<MapSection />} />
      </Routes>
    </Router>
  );
}
