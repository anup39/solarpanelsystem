import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MapSection from "../pages/MapSection";

export default function Routers({ loaded, map, onLoaded, onMap }) {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home loaded={loaded} map={map} onLoaded={onLoaded} onMap={onMap} />
          }
        />
        <Route
          exact
          path="/map"
          element={
            <MapSection
              loaded={loaded}
              map={map}
              onLoaded={onLoaded}
              onMap={onMap}
            />
          }
        />
      </Routes>
    </Router>
  );
}
