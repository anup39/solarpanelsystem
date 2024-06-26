import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

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
