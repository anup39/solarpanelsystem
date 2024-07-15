import React, { useRef, useState } from "react";
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

const apiKey = "AIzaSyDBU5pn5aaEXcYXqpIjFDV7jQsTk2uMyy0";

export default function GooglePlacesAutoComplete({ map }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const palceRef = useRef();
  const google = window.google;

  function handleAutoCompleteCrossClick() {
    palceRef.current.value = "";
  }
  function onPlaceChanged() {
    if (searchResult != null) {
      //variable to store the result
      const place = searchResult.getPlace();
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
              navigate("/map");
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
        <ClearIcon sx={{ height: 25, width: 30 }} />
      </button>
      <GoogleAutoComplete onPlaceChanged={onPlaceChanged} onLoad={onLoad}>
        <input type="text" ref={palceRef}></input>
      </GoogleAutoComplete>
    </div>
  ) : null;
}
