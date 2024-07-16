import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import plotPanel from "../../maputils/plotPanel";

export default function SliderSizes({
  min,
  max,
  value,
  onPanelCount,
  map,
  onShowDetails,
  onLoader,
  onPanelMax,
  onPanelMin,
  onAnnualSunshine,
  onRoofArea,
  onMaxPanelCount,
  onCo2Savings,
  onYearlyEnergy,
}) {
  const dispatch = useDispatch();
  const handlePanelCount = (event, newValue) => {
    onPanelCount(newValue);
    plotPanel(
      window.lat,
      window.lng,
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
      onCo2Savings,
      onYearlyEnergy,
      newValue
    );
  };

  return (
    <Box sx={{ width: 300, paddingLeft: 3, paddingRight: 3 }}>
      <Slider
        sx={{
          color: "#3d3880",
          "& .MuiSlider-thumb": {
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "0px 0px 0px 8px rgba(61, 56, 128, 0.16)",
            },
          },
          "& .MuiSlider-track": {
            height: 4,
          },
          "& .MuiSlider-rail": {
            height: 4,
          },
        }}
        min={min}
        max={max}
        step={3}
        value={value}
        aria-label="Small"
        valueLabelDisplay="auto"
        onChange={handlePanelCount}
      />
    </Box>
  );
}

SliderSizes.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onPanelCount: PropTypes.func.isRequired,
  map: PropTypes.object,
  onShowDetails: PropTypes.func.isRequired,
  onLoader: PropTypes.func.isRequired,
  onPanelMax: PropTypes.func.isRequired,
  onPanelMin: PropTypes.func.isRequired,
  onAnnualSunshine: PropTypes.func.isRequired,
  onRoofArea: PropTypes.func.isRequired,
  onMaxPanelCount: PropTypes.func.isRequired,
  onCo2Savings: PropTypes.func.isRequired,
  onYearlyEnergy: PropTypes.func.isRequired,
};
