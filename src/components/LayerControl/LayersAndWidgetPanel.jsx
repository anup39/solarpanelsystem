import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

export default function LayersAndWidgetPanel({ map, popUpRef }) {
  return (
    <Box>
      <Button>Layer Main</Button>
      <Button>Layer KeepOut</Button>
    </Box>
  );
}

LayersAndWidgetPanel.propTypes = {
  map: PropTypes.object.isRequired,
  popUpRef: PropTypes.object.isRequired,
};
