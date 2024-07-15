import Map from "../map/Map";
import Loader from "../components/common/Loader";
import SliderSizes from "../components/common/SliderSizes";
import GooglePlacesAutoComplete from "../components/GooglePlacesAutoComplete";
import PropTypes from "prop-types";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Info from "@mui/icons-material/Info";

const zoom = 21;
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function MapSection({ loaded, map, onLoaded, onMap }) {
  const [currentMarker, setCurrentMarker] = useState(null);
  const [showmarker, setShowMarker] = useState(true);

  const onCurrentMarker = (marker) => {
    setCurrentMarker(marker);
  };

  return (
    <div>
      {loaded ? (
        <Map center={center} zoom={zoom} onMap={onMap} onLoaded={onLoaded} />
      ) : (
        <Loader />
      )}
      {map && (
        <GooglePlacesAutoComplete
          map={map}
          component={"MapSection"}
          onLoaded={onLoaded}
          currentMarker={currentMarker}
          onCurrentMarker={onCurrentMarker}
          showmarker={showmarker}
        />
      )}

      <div className="absolute flex flex-row top-2 right-7 bg-[#3D3880] rounded-lg gap-32">
        <div>
          <FormControlLabel
            onChange={(e) => {
              if (currentMarker) {
                // Ensure the marker reference exists
                currentMarker.setVisible(e.target.checked); // Set visibility based on checkbox
                setShowMarker(e.target.checked); // Update state
              }
            }}
            sx={{
              paddingLeft: "5px",
              paddingRight: "5px",
              color: "white",
            }}
            control={
              <Checkbox
                sx={{
                  color: "white",
                  "&.Mui-checked": {
                    color: "white",
                  },
                }}
                checked={showmarker}
              />
            }
            label="Show Marker"
          />
        </div>
      </div>

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
        <SliderSizes max={50} />
      </div>

      <div
        style={{
          display: currentMarker ? "block" : "none",
        }}
        className="absolute top-[1%] left-[40%]"
      >
        <Alert icon={<Info fontSize="inherit" />} severity="success">
          Here move the marker to the desired location
        </Alert>
      </div>
    </div>
  );
}

MapSection.propTypes = {
  loaded: PropTypes.bool.isRequired,
  map: PropTypes.object,
  onLoaded: PropTypes.func.isRequired,
  onMap: PropTypes.func.isRequired,
};
