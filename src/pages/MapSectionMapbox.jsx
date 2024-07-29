import { useRef } from "react";
import Mapbox from "../map/Mapbox";
import maplibregl from "maplibre-gl";
import MapLoader from "../components/MapLoader";
import { useSelector } from "react-redux";

export default function MapSectionMapbox() {
  const popUpRef = useRef(new maplibregl.Popup({ closeOnClick: false }));
  const showMapLoader = useSelector((state) => state.mapView.showMapLoader);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {showMapLoader ? <MapLoader /> : null}
      <Mapbox popUpRef={popUpRef}></Mapbox>
    </div>
  );
}
