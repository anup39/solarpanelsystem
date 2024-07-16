import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import PropTypes from "prop-types";

export default function SliderSizes({ min, max, value, onPanelCount }) {
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
