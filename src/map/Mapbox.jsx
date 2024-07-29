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
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import {
  setShowKeyInfo,
  setTypeOfGeometry,
  setWKTGeometry,
} from "../reducers/DrawnGeometry";
import LayersControl from "../components/LayerControl/LayerControl";
import DrawControl from "../components/DrawControl/DrawControl";
import PopupControl from "../components/PopupControl/PopupControl";
import { Card, Typography } from "@mui/material";

import GeocoderApi from "../maputils/GeocoderApi";

const modes = MapboxDraw.modes;
modes.draw_rectangle = DrawRectangle;

export default function Mapbox({ popUpRef }) {
  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const show_key_info = useSelector(
    (state) => state.drawnPolygon.show_key_info
  );
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

  // For geocoder
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

  useEffect(() => {
    if (map) {
      map.on("load", () => {
        const draw = new MapboxDraw({
          displayControlsDefault: false,
          modes: modes,
        });
        // 1 Draw and its layer
        map.addControl(draw);
        map.draw = draw;
        map.on("draw.create", function (event) {
          dispatch(setShowKeyInfo(true));
          const feature = event.features;
          const geometry = feature[0].geometry;
          const type_of_geometry = feature[0].geometry.type;
          if (type_of_geometry === "Point") {
            const coordinates = geometry.coordinates;
            const wktCoordinates_final = `POINT (${coordinates[0]} ${coordinates[1]})`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
          if (type_of_geometry === "Polygon") {
            const coordinates = geometry.coordinates[0];
            // const wktCoordinates = coordinates
            //   .map((coord) => `${coord[0]} ${coord[1]}`)
            //   .join(", ");
            // const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
            dispatch(setWKTGeometry([coordinates]));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
          if (type_of_geometry === "LineString") {
            const coordinates = geometry.coordinates;
            const wktCoordinates = coordinates
              .map((coord) => `${coord[0]} ${coord[1]}`)
              .join(", ");
            const wktCoordinates_final = `LINESTRING (${wktCoordinates})`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
        });
        map.on("draw.update", function updateFunctionProject(event) {
          dispatch(setShowKeyInfo(true));
          // const draw = map.draw;
          const feature = event.features;
          const geometry = feature[0].geometry;
          const type_of_geometry = feature[0].geometry.type;
          if (type_of_geometry === "Point") {
            const coordinates = geometry.coordinates;
            const wktCoordinates_final = `POINT (${coordinates[0]} ${coordinates[1]})`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
          if (type_of_geometry === "Polygon") {
            const coordinates = geometry.coordinates[0];
            // const wktCoordinates = coordinates
            //   .map((coord) => `${coord[0]} ${coord[1]}`)
            //   .join(", ");
            // const wktCoordinates_final = `POLYGON ((${wktCoordinates}))`;
            dispatch(setWKTGeometry([coordinates]));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
          if (type_of_geometry === "LineString") {
            const coordinates = geometry.coordinates;
            const wktCoordinates = coordinates
              .map((coord) => `${coord[0]} ${coord[1]}`)
              .join(", ");
            const wktCoordinates_final = `LINESTRING (${wktCoordinates})`;
            dispatch(setWKTGeometry(wktCoordinates_final));
            dispatch(setTypeOfGeometry(type_of_geometry));
          }
        });
      });
    }
  }, [map, dispatch]);

  useEffect(() => {
    if (map) {
      const layer_control = new LayersControl();
      map.addControl(layer_control, "top-left");
      layer_control.updateProject(popUpRef);
      map.addControl(new maplibregl.NavigationControl(), "top-right");
      const draw_control = new DrawControl();
      map.addControl(draw_control, "top-right");
      draw_control.updateDrawControl(popUpRef);
      map.addControl(new maplibregl.ScaleControl(), "bottom-left");
      // const popup_control = new PopupControl();
      // map.addControl(popup_control, "bottom-right");
    }
  }, [map, popUpRef]);
  return (
    <div ref={mapContainer} id="map" className="map">
      {show_key_info ? (
        <Card
          sx={{
            position: "absolute",
            top: "12px",
            right: "41%",
            zIndex: 99999,
          }}
        >
          <Typography sx={{ m: 1 }} variant="body2" component="p">
            Press
            <span style={{ color: "#D51B60" }}> Enter </span> to Save drawing
            and
            <span style={{ color: "#D51B60" }}> Esc </span>
            to cancel
          </Typography>
        </Card>
      ) : null}
    </div>
  );
}

Mapbox.propTypes = {
  popUpRef: PropTypes.object.isRequired,
};
