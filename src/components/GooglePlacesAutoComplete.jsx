import { useRef, useState } from "react";
import { Autocomplete as GoogleAutoComplete } from "@react-google-maps/api";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch } from "react-redux";
import "./GooglePlacesAutoComplete.css";
import plotPanel from "../maputils/plotPanel";
import PropTypes from "prop-types";

export default function GooglePlacesAutoComplete({
  map,
  component,
  onLoaded,
  currentMarker,
  onCurrentMarker,
  showmarker,
  onShowDetails,
  onLoader,
  onPanelCount,
  onPanelMax,
  onPanelMin,
  onAnnualSunshine,
  onRoofArea,
  onMaxPanelCount,
  onCo2Savings,
}) {
  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState(null);
  const palceRef = useRef();
  const google = window.google;

  const [inputValue, setInputValue] = useState("");

  function handleAutoCompleteCrossClick() {
    palceRef.current.value = "";
  }
  function onPlaceChanged() {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      setInputValue(place.formatted_address);
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
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode(
                { location: { lat: lat, lng: lng } },
                (results, status) => {
                  // Step 3: Handle the Response
                  if (status === "OK") {
                    if (results[0]) {
                      setInputValue(results[0].formatted_address);

                      plotPanel(
                        lat,
                        lng,
                        map,
                        dispatch,
                        onShowDetails,
                        onLoader,
                        onPanelCount,
                        onPanelMax,
                        onPanelMin,
                        onAnnualSunshine,
                        onRoofArea,
                        onMaxPanelCount,
                        onCo2Savings
                      );
                      // If you specifically want the place name, you might need to parse the address components
                      // The place name might not be directly available or consistent across different locations
                      // For example, you might consider the first component with a "locality" type as the place name
                      //   const placeName = results[0]?.address_components?.find(
                      //     (component) => component.types.includes("locality")
                      //   ).long_name;
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
            draggableMarker.setVisible(showmarker);
            onCurrentMarker(draggableMarker);

            // Step 5: Plot the panel
            plotPanel(
              lat,
              lng,
              map,
              dispatch,
              onShowDetails,
              onLoader,
              onPanelCount,
              onPanelMax,
              onPanelMin,
              onAnnualSunshine,
              onRoofArea,
              onMaxPanelCount,
              onCo2Savings
            );
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
  currentMarker: PropTypes.object,
  onCurrentMarker: PropTypes.func.isRequired,
  showmarker: PropTypes.bool.isRequired,
  onShowDetails: PropTypes.func.isRequired,
  onLoader: PropTypes.func.isRequired,
  onPanelCount: PropTypes.func.isRequired,
  onPanelMax: PropTypes.func.isRequired,
  onPanelMin: PropTypes.func.isRequired,
  onAnnualSunshine: PropTypes.func.isRequired,
  onRoofArea: PropTypes.func.isRequired,
  onMaxPanelCount: PropTypes.func.isRequired,
  onCo2Savings: PropTypes.func.isRequired,
};
