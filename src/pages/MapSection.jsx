import { useEffect, useState } from "react";
import Map from "../map/Map";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/common/Loader";
import { panelsPalette } from "../maputils/colors";
import { createPalette, rgbToColor, normalize } from "../maputils/visualize";
import SliderSizes from "../components/common/SliderSizes";
import Autocompleteplaces from "../components/Autocompleteplaces";
import axios from "axios";
import { setCoordinates, setBuildingInsights } from "../reducers/Map";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../reducers/DisplaySettings";
import GooglePlacesAutoComplete from "../components/GooglePlacesAutoComplete";

const zoom = 21;

export default function MapSection({ loaded, map, onLoaded, onMap }) {
  const dispatch = useDispatch();
  // const place = useSelector((state) => state.map.place);
  const [loadedData, setLoadedData] = useState(false);
  const [size, setSize] = useState(0);
  // const [map, setMap] = useState();
  const center = useSelector((state) => state.map.coordinates);
  const buildingInsights = useSelector((state) => state.map.buildingInsights);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (buildingInsights && loaded && map) {
      // Create the solar panels on the map.
      const solarPotential = buildingInsights.solarPotential;
      const palette = createPalette(panelsPalette).map(rgbToColor);
      const minEnergy =
        solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
      const maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;
      const size = solarPotential.solarPanels.length;
      setSize(size);
      const solarPanels = solarPotential.solarPanels
        .slice(0, 70)
        .map((panel, index) => {
          const [w, h] = [
            solarPotential.panelWidthMeters / 2,
            solarPotential.panelHeightMeters / 2,
          ];
          const points = [
            { x: +w, y: +h }, // top right
            { x: +w, y: -h }, // bottom right
            { x: -w, y: -h }, // bottom left
            { x: -w, y: +h }, // top left
            { x: +w, y: +h }, //  top right
          ];
          const orientation = panel.orientation == "PORTRAIT" ? 90 : 0;
          const azimuth =
            solarPotential.roofSegmentStats[panel.segmentIndex].azimuthDegrees;
          const colorIndex = Math.round(
            normalize(panel.yearlyEnergyDcKwh, maxEnergy, minEnergy) * 255
          );
          const polygon = new window.google.maps.Polygon({
            paths: points.map(({ x, y }) =>
              window?.google?.maps?.geometry?.spherical.computeOffset(
                { lat: panel.center.latitude, lng: panel.center.longitude },
                Math.sqrt(x * x + y * y),
                Math.atan2(y, x) * (180 / Math.PI) + orientation + azimuth
              )
            ),
            strokeColor: "#8B0000",
            strokeOpacity: 0.9,
            strokeWeight: 1,
            fillColor: palette[colorIndex],
            fillOpacity: 0.9,
          });

          polygon.setMap(map);

          console.log(index, "index");
          return polygon;
        });
    }
  }, [buildingInsights, loaded, map]);

  const handleContinue = (e) => {
    const place = JSON.parse(localStorage.getItem("place"));
    setLoading(true);
    e.preventDefault();
    console.log(place, "place");
    if (place.description) {
      const address = place.description;
      const apiKey = "AIzaSyDBU5pn5aaEXcYXqpIjFDV7jQsTk2uMyy0";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`;

      axios
        .get(url)
        .then((response) => {
          const { lat, lng } = response.data.results[0].geometry.location;
          console.log(lat, lng, "lat long");
          // dispatch(setCoordinates({ lat, lng }));
          localStorage.setItem("coordinates", JSON.stringify({ lat, lng }));
          //   navigate("/map", { state: { lat, lng } });
          const args = {
            "location.latitude": lat.toFixed(5),
            "location.longitude": lng.toFixed(5),
          };
          console.log("GET buildingInsights\n", args);
          const params = new URLSearchParams({ ...args, key: apiKey });
          fetch(
            `https://solar.googleapis.com/v1/buildingInsights:findClosest?${params}`
          ).then(async (response) => {
            setLoading(false);
            const content = await response.json();
            if (response.status != 200) {
              console.error("findClosestBuilding\n", content);
              dispatch(setshowToast(true));
              dispatch(settoastType("error"));
              dispatch(
                settoastMessage(
                  "No building found near the location. Please try again."
                )
              );
              throw content;
            }
            // navigate("/map");
            // window.location.href = "/map";
            // dispatch(setBuildingInsights(content));
            localStorage.setItem("buildingInsights", JSON.stringify(content));
            console.log("buildingInsightsResponse", content);

            const solarPotential = content.solarPotential;
            const palette = createPalette(panelsPalette).map(rgbToColor);
            const minEnergy =
              solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
            const maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;
            const size = solarPotential.solarPanels.length;
            setSize(size);
            solarPotential.solarPanels.slice(0, 70).map((panel, index) => {
              const [w, h] = [
                solarPotential.panelWidthMeters / 2,
                solarPotential.panelHeightMeters / 2,
              ];
              const points = [
                { x: +w, y: +h }, // top right
                { x: +w, y: -h }, // bottom right
                { x: -w, y: -h }, // bottom left
                { x: -w, y: +h }, // top left
                { x: +w, y: +h }, //  top right
              ];
              const orientation = panel.orientation == "PORTRAIT" ? 90 : 0;
              const azimuth =
                solarPotential.roofSegmentStats[panel.segmentIndex]
                  .azimuthDegrees;
              const colorIndex = Math.round(
                normalize(panel.yearlyEnergyDcKwh, maxEnergy, minEnergy) * 255
              );
              const polygon = new window.google.maps.Polygon({
                paths: points.map(({ x, y }) =>
                  window?.google?.maps?.geometry?.spherical.computeOffset(
                    {
                      lat: panel.center.latitude,
                      lng: panel.center.longitude,
                    },
                    Math.sqrt(x * x + y * y),
                    Math.atan2(y, x) * (180 / Math.PI) + orientation + azimuth
                  )
                ),
                strokeColor: "#8B0000",
                strokeOpacity: 0.9,
                strokeWeight: 1,
                fillColor: palette[colorIndex],
                fillOpacity: 0.9,
              });

              console.log("polygon", polygon);
              console.log(map, "map");

              polygon.setMap(map);

              console.log(index, "index");
              return polygon;
            });
          });
        })
        .catch((error) => console.error("Geocoding error:", error));
    }
  };

  return (
    <div>
      {loaded ? (
        <Map center={center} zoom={zoom} onMap={onMap} onLoaded={onLoaded} />
      ) : (
        <Loader />
      )}

      <GooglePlacesAutoComplete map={map} />

      <div
        style={{
          display: "flex",
          position: "absolute",
          bottom: "10px",
          left: "45%",
          backgroundColor: "white",
          borderRadius: "5px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1>Panel Count:</h1>
        </div>
        <SliderSizes max={size} />
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          // bottom: "10px",
          // left: "45%",
          backgroundColor: "white",
          borderRadius: "5px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      ></div>
    </div>
  );
}
