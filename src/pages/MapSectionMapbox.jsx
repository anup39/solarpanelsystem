import { useRef } from "react";
import Mapbox from "../map/Mapbox";
import maplibregl from "maplibre-gl";

export default function MapSectionMapbox() {
  const popUpRef = useRef(new maplibregl.Popup({ closeOnClick: false }));

  return (
    <div>
      <Mapbox popUpRef={popUpRef}></Mapbox>
    </div>
  );
}
