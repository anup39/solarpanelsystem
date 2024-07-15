import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import PropTypes from "prop-types";

export default function SliderSizes({ max }) {
  return (
    <Box sx={{ width: 300, paddingLeft: 3, paddingRight: 3 }}>
      <Slider
        min={0}
        max={max}
        step={1}
        defaultValue={70}
        aria-label="Small"
        valueLabelDisplay="auto"
      />
    </Box>
  );
}

SliderSizes.propTypes = {
  max: PropTypes.number.isRequired,
};
