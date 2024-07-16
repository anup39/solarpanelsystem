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
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { TextField } from "@mui/material";

const zoom = 21;
const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function MapSection({ loaded, map, onLoaded, onMap }) {
  const [loader, setLoader] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [showmarker, setShowMarker] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [panelCapacity, setPanelCapacity] = useState(250);

  const onLoader = (value) => {
    setLoader(value);
  };

  const onCurrentMarker = (marker) => {
    setCurrentMarker(marker);
  };

  const onShowDetails = (value) => {
    setShowDetails(value);
  };

  // panel count part
  const [panelCount, setPanelCount] = useState(0);
  const [panelMax, setPanelMax] = useState(100);
  const [panelMin, setPanelMin] = useState(0);
  const onPanelCount = (value) => {
    setPanelCount(value);
  };
  const onPanelMax = (value) => {
    setPanelMax(value);
  };
  const onPanelMin = (value) => {
    setPanelMin(value);
  };

  // insights part
  const [annualSunshine, setAnnualSunshine] = useState(0);
  const [roofArea, setRoofArea] = useState(0);
  const [maxPanelCount, setMaxPanelCount] = useState(0);
  const [co2Savings, setCo2Savings] = useState(0);

  const onAnnualSunshine = (value) => {
    setAnnualSunshine(value);
  };
  const onRoofArea = (value) => {
    setRoofArea(value);
  };
  const onMaxPanelCount = (value) => {
    setMaxPanelCount(value);
  };
  const onCo2Savings = (value) => {
    setCo2Savings(value);
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
          onLoader={onLoader}
          onPanelCount={onPanelCount}
          onPanelMax={onPanelMax}
          onPanelMin={onPanelMin}
          onAnnualSunshine={onAnnualSunshine}
          onRoofArea={onRoofArea}
          onMaxPanelCount={onMaxPanelCount}
          onCo2Savings={onCo2Savings}
        />
      )}

      {/* Insights part */}

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
              <HouseIcon
                sx={{
                  color: "#3d3880",
                }}
              />
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
              <WbSunnyIcon
                sx={{
                  color: "#3d3880",
                }}
              />
              <Typography variant="h6" sx={{ color: "black" }}>
                Annual Sunshine
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: "black" }}>
                {annualSunshine} hr
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
              <SquareFootIcon
                sx={{
                  color: "#3d3880",
                }}
              />
              <Typography variant="h6" sx={{ color: "black" }}>
                Roof Area
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: "black" }}>
                {roofArea} m²
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
              <SolarPowerIcon
                sx={{
                  color: "#3d3880",
                }}
              />
              <Typography variant="h6" sx={{ color: "black" }}>
                Max Panel Count
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: "black" }}>
                {maxPanelCount} panels
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
              <Co2Icon
                sx={{
                  color: "#3d3880",
                }}
              />
              <Typography variant="h6" sx={{ color: "black" }}>
                CO₂ savings
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1" sx={{ color: "black" }}>
                {co2Savings} Kg/MWh
              </Typography>
            </Box>
          </Box>
        </Box>
      </div>

      {/* Panel count slider and capacity */}
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
          <Gauge
            width={100}
            height={100}
            value={(panelCount / maxPanelCount) * 100}
            sx={() => ({
              [`& .${gaugeClasses.valueArc}`]: {
                fill: "#3d3880",
              },
            })}
          />
          <Typography
            sx={{
              ml: 3,
            }}
          >
            {panelCount}/{maxPanelCount}
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
          <Gauge
            width={100}
            height={100}
            value={60}
            sx={() => ({
              [`& .${gaugeClasses.valueArc}`]: {
                fill: "#3d3880",
              },
            })}
          />
          <Typography
            sx={{
              ml: 3,
            }}
          >
            {0} KWh
          </Typography>
        </Box>
      </div>

      {/* Show Marker checkbox */}
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

      {/* Panel count and yearly enegry gauge part */}
      <div
        style={{
          display: showDetails ? "block" : "none",
        }}
        className="absolute bottom-[1%] left-[30%]"
      >
        <Box
          sx={{
            color: "black",
            backgroundColor: "white",
            borderRadius: "5px",
            paddingLeft: "10px",
            paddingRight: "10px",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: "black" }}>
              Panel Count
            </Typography>
          </Box>
          <Box>
            <SliderSizes
              min={panelMin}
              max={panelMax}
              value={panelCount}
              onPanelCount={onPanelCount}
            />
          </Box>
          <Box>
            <TextField
              placeholder="Panel Capacity"
              fullWidth
              sx={{
                width: "200px",
              }}
              inputProps={{ min: 250, max: 1000 }}
              type="number"
              id="outlined-basic"
              label="Panel Capacity"
              variant="outlined"
              value={panelCapacity}
              onChange={(e) => setPanelCapacity(e.target.value)}
            />
          </Box>
        </Box>
      </div>

      {/* Alert for the user to move the marker to the desired location */}
      <div
        style={{
          display: currentMarker && showmarker ? "block" : "none",
        }}
        className="absolute top-[1%] left-[40%]"
      >
        <Alert icon={<Info fontSize="inherit" />} severity="success">
          Here move the marker to the desired building
        </Alert>
      </div>

      <div
        style={{
          display: loader ? "block" : "none",
        }}
      >
        <Loader></Loader>
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
