import { Box, Checkbox, Typography, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import handleLayerChecked from "../../maputils/handleLayerChecked";
import PentagonIcon from "@mui/icons-material/Pentagon";
import {
  setId,
  setViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";

export default function LayersAndWidgetPanel({ map, popUpRef }) {
  const { mode } = useSelector((state) => state.drawnPolygon);
  const maingeojosn = useSelector((state) => state.mapView.maingeojosn);
  const keepoutgeojson = useSelector((state) => state.mapView.keepoutgeojson);
  const dispatch = useDispatch();
  const handleDraw = (event, layer_name) => {
    const popups = document.getElementsByClassName("maplibregl-popup");
    if (popups.length) {
      popups[0].remove();
    }
    const draw = map.draw;
    draw.deleteAll();
    dispatch(setWKTGeometry(null));
    dispatch(setTypeOfGeometry(null));
    dispatch(setId(null));
    dispatch(setViewName(null));
    dispatch(setFeatureId(null));
    dispatch(setComponent(null));

    if (mode && mode === "Edit") {
      const layerId = layer_name + "layer";
      map.setFilter(layerId, null);
    }
    const type_of_geometry = "Polygon";
    if (type_of_geometry === "Polygon") {
      draw.changeMode("draw_polygon");
    }
    if (type_of_geometry === "LineString") {
      draw.changeMode("draw_line_string");
    }
    if (type_of_geometry === "Point") {
      draw.changeMode("draw_point");
    }
    // need id here
    dispatch(setId(layer_name));
    dispatch(setViewName(layer_name));
    dispatch(setMode("Draw"));
    dispatch(setComponent("category"));
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "200px",
        }}
      >
        <Checkbox
          onClick={(event) =>
            handleLayerChecked(event, "Main", map, popUpRef, maingeojosn)
          }
        />
        <Typography variant="h6">Main</Typography>
        <Tooltip title={"Draw Main"}>
          <PentagonIcon
            size="small"
            onClick={(event) => handleDraw(event, "Main")}
            sx={{
              marginLeft: "10px",
              backgroundColor: "#FFFFF",
              color: "red",
              "&:hover": { cursor: "pointer" },
            }}
          />
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "200px",
        }}
      >
        <Checkbox
          onClick={(event) =>
            handleLayerChecked(event, "Keepout", map, popUpRef, keepoutgeojson)
          }
        />
        <Typography variant="h6">Keepout</Typography>
        <Tooltip title={"Draw Keep"}>
          <PentagonIcon
            size="small"
            onClick={(event) => handleDraw(event, "Keepout")}
            sx={{
              marginLeft: "10px",
              backgroundColor: "#FFFFF",
              color: "yellow",
              "&:hover": { cursor: "pointer" },
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
}

LayersAndWidgetPanel.propTypes = {
  map: PropTypes.object.isRequired,
  popUpRef: PropTypes.object.isRequired,
};
