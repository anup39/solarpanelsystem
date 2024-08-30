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
import { Card, Typography, Button, Box, Divider } from "@mui/material";
// import AddLayerAndSourceToMap from "../maputils/AddLayerAndSourceToMap";
import TickPlacementBars from "../components/common/Barchart";

import GeocoderApi from "../maputils/GeocoderApi";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../reducers/DisplaySettings";
import { setSolarDetails, setApiDetails } from "../reducers/MapView";

const modes = MapboxDraw.modes;
modes.draw_rectangle = DrawRectangle;

export default function Mapbox({ popUpRef }) {
  const dispatch = useDispatch();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const show_key_info = useSelector(
    (state) => state.drawnPolygon.show_key_info
  );
  const showCalculate = useSelector((state) => state.mapView.showCalculate);

  const maingeojson = useSelector((state) => state.mapView.maingeojosn);

  const keepoutgeojson = useSelector((state) => state.mapView.keepoutgeojson);
  const solar_details = useSelector((state) => state.mapView.solar_details);
  const api_details = useSelector((state) => state.mapView.api_details);

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

  const handleCalculate = () => {
    console.log("Calculating");
    console.log(maingeojson, "main geojson");
    console.log(keepoutgeojson, "keepout geojson");
    if (maingeojson.features.length == 0) {
      dispatch(settoastType("error"));
      dispatch(settoastMessage("There should at least one main area"));
      dispatch(setshowToast(true));
    } else {
      let keepout_area = 0;
      keepoutgeojson?.features?.forEach((feature) => {
        keepout_area += parseInt(feature?.properties.area);
      });
      const roof_area =
        parseInt(maingeojson?.features[0]?.properties?.area) - keepout_area;
      const number_of_panel = Math.ceil(roof_area / 2.38);
      const panelcapacity = 470;
      const peakpower = panelcapacity * number_of_panel;
      const solar_potential = (
        (roof_area / number_of_panel) *
        panelcapacity
      ).toFixed(2);
      dispatch(
        setSolarDetails({
          roof_area,
          number_of_panel,
          panelcapacity,
          solar_potential,
        })
      );
      const lat =
        maingeojson?.features[0].properties?.centroid.geometry.coordinates[1];
      const lon =
        maingeojson?.features[0].properties?.centroid.geometry.coordinates[0];
      axios
        .get(
          `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?outputformat=json&lat=${lat}&lon=${lon}&raddatabase=PVGIS-SARAH2&browser=0&peakpower=${
            peakpower / 1000
          }&loss=14&mountingplace=free&pvtechchoice=crystSi&angle=35&aspect=0&usehorizon=1&userhorizon=&js=1`
          // {
          //   headers: {
          //     "Content-Type": "application/json",
          //     "Access-Control-Allow-Origin": "*", // Allow all origins
          //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allow specific methods
          //     "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
          //   },
          // }
        )
        .then((res) => {
          console.log(res, "res");
          dispatch(setApiDetails(res.data));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

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
      {showCalculate ? (
        <Card
          sx={{
            position: "absolute",
            top: "12px",
            right: "21%",
            zIndex: 99999,
          }}
        >
          <Button onClick={handleCalculate}>Calculate</Button>
        </Card>
      ) : null}
      {solar_details ? (
        <Card
          sx={{
            position: "absolute",
            top: "12px",
            left: "21%",
            zIndex: 99999,
            padding: "10px",
          }}
        >
          <Typography variant="h6">Solar Details</Typography>
          <Typography variant="body1">
            Roof Area: {solar_details?.roof_area} meter square
          </Typography>
          <Typography variant="body1">
            Number of panel: {solar_details?.number_of_panel}
          </Typography>
          <Typography variant="body1">
            Panel Capacity: {solar_details?.panelcapacity} Watt
          </Typography>
          <Typography variant="body1">
            Solar potential: {solar_details?.solar_potential} KWh
          </Typography>
        </Card>
      ) : null}

      {api_details ? (
        <Card
          sx={{
            position: "absolute",
            bottom: "5px",
            left: "1%",
            zIndex: 99999,
            padding: "10px",
          }}
        >
          <Box>
            <Typography variant="h6">Energy Details</Typography>
            <Divider></Divider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "5px",
                gap: "10px",
              }}
            >
              <Typography>Yearly PV energy production [kWh]: </Typography>
              <Typography>{api_details.outputs.totals.fixed.E_y}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "5px",
                gap: "10px",
              }}
            >
              <Typography>Monthly PV energy production [kWh]: </Typography>
              <Typography>{api_details.outputs.totals.fixed.E_m}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "5px",
                gap: "10px",
              }}
            >
              <Typography>Daily PV energy production [kWh]: </Typography>
              <Typography>{api_details.outputs.totals.fixed.E_d}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "5px",
                gap: "10px",
              }}
            >
              <Typography>Yearly in-plane irradiation [kWh/m2]:</Typography>
              <Typography>
                {api_details.outputs.totals.fixed["H(i)_y"]}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "5px",
                gap: "10px",
              }}
            >
              <Typography>Year-to-year variability [kWh]:</Typography>
              <Typography>
                {api_details.outputs.totals.fixed["SD_y"]}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                // padding: "5px",
                gap: "10px",
              }}
            >
              <Typography>Total loss [%]:</Typography>
              <Typography>
                {" "}
                {api_details.outputs.totals.fixed["l_total"]}
              </Typography>
            </Box>
          </Box>
          <Box>
            <TickPlacementBars data={api_details} />
          </Box>
        </Card>
      ) : null}
    </div>
  );
}

Mapbox.propTypes = {
  popUpRef: PropTypes.object.isRequired,
};
