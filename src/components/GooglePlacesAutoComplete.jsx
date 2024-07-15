import { useRef, useState } from "react";
import { Autocomplete as GoogleAutoComplete } from "@react-google-maps/api";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch } from "react-redux";
import "./GooglePlacesAutoComplete.css";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../reducers/DisplaySettings";
import { useNavigate } from "react-router-dom";
import { createPalette, rgbToColor, normalize } from "../maputils/visualize";
import { panelsPalette } from "../maputils/colors";
import PropTypes from "prop-types";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function GooglePlacesAutoComplete({ map, component, onLoaded }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState(null);
  const palceRef = useRef();
  const google = window.google;
  const [currentMarker, setCurrentMarker] = useState(null);
  const [inputValue, setInputValue] = useState("");

  console.log("google", google);

  function handleAutoCompleteCrossClick() {
    palceRef.current.value = "";
  }
  function onPlaceChanged() {
    if (searchResult != null) {
      //variable to store the result
      const place = searchResult.getPlace();
      console.log(place.formatted_address, "place");
      setInputValue(place.formatted_address);
      //variable to store the name from place details result
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        {
          address: place.formatted_address,
        },
        (results, status) => {
          // Step 4: Logic when  the lat and long is obtained after geocoding
          if (status === google.maps.GeocoderStatus.OK) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            map.panTo({ lat: lat, lng: lng });
            // map.setZoom(15);

            // Step 1 & 2: Check if there's an existing marker and remove it
            if (currentMarker) {
              currentMarker.setMap(null);
            }

            // Step 3: Create the new marker
            const draggableMarker = new window.google.maps.Marker({
              position: { lat: lat, lng: lng },
              map: map,
              draggable: true,
            });

            draggableMarker.addListener("dragend", () => {
              const lat = draggableMarker.getPosition().lat();
              const lng = draggableMarker.getPosition().lng();
              map.panTo({ lat: lat, lng: lng });
              // map.setZoom(15);

              // Step 1: Initialize the Geocoder
              const geocoder = new window.google.maps.Geocoder();

              // Step 2: Geocode the Latitude and Longitude
              geocoder.geocode(
                { location: { lat: lat, lng: lng } },
                (results, status) => {
                  // Step 3: Handle the Response
                  if (status === "OK") {
                    if (results[0]) {
                      // This is the full address
                      console.log(results[0].formatted_address, "full address");
                      setInputValue(results[0].formatted_address);

                      // If you specifically want the place name, you might need to parse the address components
                      // The place name might not be directly available or consistent across different locations
                      // For example, you might consider the first component with a "locality" type as the place name
                      const placeName = results[0]?.address_components?.find(
                        (component) => component.types.includes("locality")
                      ).long_name;
                      console.log(placeName);
                    } else {
                      console.log("No results found");
                    }
                  } else {
                    console.error("Geocoder failed due to: " + status);
                  }
                }
              );
            });

            // Step 4: Store the new marker reference for future removal
            setCurrentMarker(draggableMarker);

            const args = {
              "location.latitude": lat.toFixed(5),
              "location.longitude": lng.toFixed(5),
            };
            console.log("GET buildingInsights\n", args);
            const params = new URLSearchParams({ ...args, key: apiKey });
            fetch(
              `https://solar.googleapis.com/v1/buildingInsights:findClosest?${params}`
            ).then(async (response) => {
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

              //   window.location.href = "/map";
              //   dispatch(setBuildingInsights(content));
              localStorage.setItem("buildingInsights", JSON.stringify(content));
              console.log("buildingInsightsResponse", content);

              const solarPotential = content.solarPotential;
              const palette = createPalette(panelsPalette).map(rgbToColor);
              const minEnergy =
                solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
              const maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;
              const size = solarPotential.solarPanels.length;
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

              if (component === "Home") {
                navigate(`/map/${lat}/${lng}`);
              }
            });
          }
        }
      );
    } else {
      alert("Please enter text");
    }
  }
  function onLoad(autocomplete) {
    setSearchResult(autocomplete);
  }
  return google ? (
    <div className="google-autocomplete">
      <button onClick={handleAutoCompleteCrossClick}>
        <ClearIcon sx={{ height: 25, width: 30, color: "black" }} />
      </button>
      <GoogleAutoComplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
        <input
          value={inputValue}
          type="text"
          ref={palceRef}
          onChange={(e) => setInputValue(e.target.value)}
        ></input>
      </GoogleAutoComplete>
    </div>
  ) : null;
}

GooglePlacesAutoComplete.propTypes = {
  map: PropTypes.object.isRequired,
  component: PropTypes.string.isRequired,
  onLoaded: PropTypes.func.isRequired,
};
