import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MapSection from "../pages/MapSection";
import MapSectionMapbox from "../pages/MapSectionMapbox";
import PropTypes from "prop-types";

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
            // <MapSection
            //   loaded={loaded}
            //   map={map}
            //   onLoaded={onLoaded}
            //   onMap={onMap}
            // />
            <MapSectionMapbox />
          }
        />
      </Routes>
    </Router>
  );
}

Routers.propTypes = {
  loaded: PropTypes.bool.isRequired,
  map: PropTypes.object,
  onLoaded: PropTypes.func.isRequired,
  onMap: PropTypes.func.isRequired,
};
