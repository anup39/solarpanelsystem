import React, { useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import RectangleIcon from "@mui/icons-material/Rectangle";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { setCreatedPolygon } from "../reducers/Map";
export default function AddPolygon({ map, onCreatedPolygon }) {
  const dispatch = useDispatch();

  const createdPolygon = useSelector((state) => state.map.createdPolygon);

  useEffect(() => {
    if (createdPolygon) {
      const polygon_ = new window.google.maps.Polygon({
        paths: createdPolygon,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        editable: false,
        draggable: false,
        clickable: false,
        geodesic: false,
      });
      polygon_.setMap(map);
      onCreatedPolygon(polygon_);
    }
  }, [createdPolygon, map]);
  const handleAddPolygonButton = () => {
    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      markerOptions: { draggable: true },
      polygonOptions: {
        fillColor: "#BCDCF9",
        fillOpacity: 0.5,
        strokeWeight: 2,
        strokeColor: "#57ACF9",
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });
    drawingManager.setMap(map);

    // Add a polygoncomplete event listener to get the initial polygon geometry
    window.google.maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      (p) => {
        drawingManager.setMap(null);
        p.setMap(null);
        const updatedCoords = p
          .getPaths()
          .getAt(0)
          .getArray()
          .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }));
        const lastItem = Object.assign({}, updatedCoords[0]); // create a copy of the first item
        updatedCoords.push(lastItem); // add the copy as the last item in the array
        dispatch(setCreatedPolygon(updatedCoords));
        // dispatch.DisplaySettings.toggleEditButtons(false);
      }
    );
  };
  return (
    <Tooltip title="Add a Polygon">
      <IconButton
        onClick={handleAddPolygonButton}
        sx={{
          "&:hover": { bgcolor: "red" },
        }}
        aria-label="Add a Polygon"
      >
        <RectangleIcon sx={{ color: "black" }} />
      </IconButton>
    </Tooltip>
  );
}

AddPolygon.propTypes = {
  map: PropTypes.object,
  onCreatedPolygon: PropTypes.func.isRequired,
};
