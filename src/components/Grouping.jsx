import ButtonGroup from "@mui/material/ButtonGroup";
import "./Grouping.css";
import PropTypes from "prop-types";
import AddPolygon from "./AddPolygon";

export default function Grouping({ map, display, onCreatedPolygon }) {
  return (
    <ButtonGroup
      sx={{ display: display ? "block" : "none" }}
      className="grouping-edit-buttons"
      variant="contained"
      aria-label="outlined primary button group"
    >
      <AddPolygon map={map} onCreatedPolygon={onCreatedPolygon} />
    </ButtonGroup>
  );
}

Grouping.propTypes = {
  map: PropTypes.object,
  display: PropTypes.bool.isRequired,
  onCreatedPolygon: PropTypes.func.isRequired,
};
