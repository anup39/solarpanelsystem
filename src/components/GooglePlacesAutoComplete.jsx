import React, { useRef, useState } from "react";
import { Autocomplete as GoogleAutoComplete } from "@react-google-maps/api";
import ClearIcon from "@mui/icons-material/Clear";
import "./GooglePlacesAutoComplete.css";

export default function GooglePlacesAutoComplete({ map }) {
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
            const long = results[0].geometry.location.lng();
            map.panTo({ lat: lat, lng: long });
            map.setZoom(15);
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
