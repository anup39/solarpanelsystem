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
import Box from "@mui/material/Box";
import { Divider, Typography } from "@mui/material";
import HouseIcon from "@mui/icons-material/House";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import Co2Icon from "@mui/icons-material/Co2";
import { Gauge } from "@mui/x-charts/Gauge";

const zoom = 21;
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function MapSection({ loaded, map, onLoaded, onMap }) {
  const [currentMarker, setCurrentMarker] = useState(null);
  const [showmarker, setShowMarker] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const onCurrentMarker = (marker) => {
    setCurrentMarker(marker);
  };

  const onShowDetails = (value) => {
    setShowDetails(value);
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
          onShowDetails={onShowDetails}
        />
      )}

      <div
        style={{
          display: showDetails ? "block" : "none",
        }}
        className="absolute top-[1%] right-[1%]"
      >
        <Box
          sx={{
            color: "black",
            backgroundColor: "white",
            borderRadius: "5px",
            paddingLeft: "10px",
            paddingRight: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: "56px",
              }}
            >
              <HouseIcon />
              <Typography variant="h6" sx={{ color: "black" }}>
                Building Insights endpoint
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: "56px",
              }}
            >
              <WbSunnyIcon />
              <Typography variant="h6" sx={{ color: "black" }}>
                Annual Sunshine
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: "black" }}>
                1,803 hr
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: "56px",
              }}
            >
              <SquareFootIcon />
              <Typography variant="h6" sx={{ color: "black" }}>
                Roof Area
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: "black" }}>
                2,399.4 m²
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: "56px",
              }}
            >
              <SolarPowerIcon />
              <Typography variant="h6" sx={{ color: "black" }}>
                Max Panel Count
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: "black" }}>
                987 panels
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: "56px",
              }}
            >
              <Co2Icon />
              <Typography variant="h6" sx={{ color: "black" }}>
                CO₂ savings
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: "black" }}>
                428.9 Kg/MWh
              </Typography>
            </Box>
          </Box>
        </Box>
      </div>

      <div
        style={{
          display: showDetails ? "block" : "none",
        }}
        className="absolute top-[30%] right-[1%] flex flex-row bg-white rounded-lg p-3"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
          }}
        >
          <Typography>Panel count</Typography>
          <Gauge width={100} height={100} value={60} />
          <Typography
            sx={{
              ml: 3,
            }}
          >
            99/977
          </Typography>
        </Box>
        <Divider></Divider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
          }}
        >
          <Typography>Yearly Energy</Typography>
          <Gauge width={100} height={100} value={60} />
          <Typography
            sx={{
              ml: 3,
            }}
          >
            99/977
          </Typography>
        </Box>
      </div>

      <div className="absolute flex flex-row top-2 right-96 bg-[#3D3880] rounded-lg gap-32">
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
          display: currentMarker && showmarker ? "block" : "none",
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
