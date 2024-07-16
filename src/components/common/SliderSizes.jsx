import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import PropTypes from "prop-types";

export default function SliderSizes({ min, max, value, onPanelCount }) {
  return (
    <Box sx={{ width: 300, paddingLeft: 3, paddingRight: 3 }}>
      <Slider
        min={min}
        max={max}
        step={3}
        value={value}
        aria-label="Small"
        valueLabelDisplay="auto"
        onChange={(e, newValue) => {
          onPanelCount(newValue);
        }}
      />
    </Box>
  );
}

SliderSizes.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onPanelCount: PropTypes.func.isRequired,
};
