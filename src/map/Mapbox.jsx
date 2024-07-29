import PropTypes from "prop-types";
import "./Mapbox.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import GeocoderApi from "../maputils/GeocoderApi";

export default function Mapbox({ popUpRef }) {
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${
        import.meta.env.VITE_MAPTILER_TOKEN
      }`,
      // center: [10.035153, 56.464267],
      center: [11.326301469413806, 55.39925417342158],
      zoom: 16,
      attributionControl: false,
    });

    window.map_global = map;
    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      const geocoder = new MaplibreGeocoder(GeocoderApi, {
        maplibregl: maplibregl,
        showResultsWhileTyping: true,
        flyTo: true,
        placeholder: "Search for a place",
        position: "top-left",
        marker: false,
      });

      // geocoder.addTo(refObj.current);
      geocoder.on("result", function (ev) {
        const coords = ev.result.geometry.coordinates;
        map.flyTo({ center: coords });
      });
      geocoder.addTo(map);
    }
  }, [map]);

  return <div ref={mapContainer} id="map" className="map"></div>;
}

Mapbox.propTypes = {
  popUpRef: PropTypes.object.isRequired,
};
