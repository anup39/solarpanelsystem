import React, { useEffect } from "react";
import { Tooltip, IconButton } from "@mui/material";
import RectangleIcon from "@mui/icons-material/Rectangle";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { addMainPolygon } from "../reducers/Map";

// Function to calculate the centroid of a polygon
function getPolygonCentroid(path) {
  let latSum = 0;
  let lngSum = 0;
  const len = path.getLength();

  for (let i = 0; i < len; i++) {
    const point = path.getAt(i);
    latSum += point.lat();
    lngSum += point.lng();
  }

  return {
    lat: latSum / len,
    lng: lngSum / len,
  };
}
export default function AddPolygon({ map, onCreatedPolygon }) {
  const dispatch = useDispatch();

  // const createdPolygon = useSelector((state) => state.map.createdPolygon);
  const mainPolygons = useSelector((state) => state.map.mainPolygons);

  // useEffect(() => {
  //   if (createdPolygon) {
  //     const polygon_ = new window.google.maps.Polygon({
  //       paths: createdPolygon,
  //       strokeColor: "#FF0000",
  //       strokeOpacity: 0.8,
  //       strokeWeight: 2,
  //       fillColor: "#FF0000",
  //       fillOpacity: 0.35,
  //       editable: true,
  //       draggable: true,
  //       clickable: true,
  //       geodesic: false,
  //     });
  //     const infoWindow = new window.google.maps.InfoWindow();
  //     console.log(infoWindow, "infowindow");

  //     polygon_.addListener("click", () => {
  //       console.log("clicked");
  //       infoWindow.setContent("Polygon");
  //       // Calculate the centroid of the polygon
  //       const centroid = getPolygonCentroid(polygon_.getPath());

  //       // Set the position of the infoWindow to the centroid
  //       infoWindow.setPosition(centroid);
  //       infoWindow.open(map);
  //     });
  //     polygon_.addListener("dragend", () => {
  //       const updatedCoords = polygon_
  //         .getPath()
  //         .getArray()
  //         .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }));
  //       const lastItem = Object.assign({}, updatedCoords[0]); // create a copy of the first item
  //       updatedCoords.push(lastItem); // add the copy as the last item in the array
  //       dispatch(setCreatedPolygon(updatedCoords));
  //     });
  //     polygon_.addListener("mouseup", () => {
  //       const updatedCoords = polygon_
  //         .getPath()
  //         .getArray()
  //         .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }));
  //       const lastItem = Object.assign({}, updatedCoords[0]); // create a copy of the first item
  //       updatedCoords.push(lastItem); // add the copy as the last item in the array
  //       dispatch(setCreatedPolygon(updatedCoords));
  //     });
  //     polygon_.setMap(map);

  //     onCreatedPolygon(polygon_);
  //   }
  // }, [createdPolygon, map]);

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
        // dispatch(setCreatedPolygon(updatedCoords));
        dispatch(
          addMainPolygon({
            id: mainPolygons.length + 1,
            polygon: updatedCoords,
          })
        );
        // dispatch.DisplaySettings.toggleEditButtons(false);

        const createdPolygon = updatedCoords;
        const polygon_ = new window.google.maps.Polygon({
          paths: createdPolygon,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          editable: false,
          draggable: false,
          clickable: true,
          geodesic: false,
        });
        const infoWindow = new window.google.maps.InfoWindow();
        console.log(infoWindow, "infowindow");

        // Ensure polygon_ is correctly instantiated and added to the map
        // Ensure polygon_ is correctly instantiated and added to the map
        if (polygon_ && map) {
          polygon_.addListener("click", () => {
            // Ensure infoWindow is correctly instantiated
            if (infoWindow) {
              // Get the ID of the polygon
              const polygonId = mainPolygons.length + 1;

              // Set the content of the infoWindow with an editable ID and Edit/Delete buttons
              infoWindow.setContent(`
        <div>
          <input type="text" id="polygonId" value="${polygonId}"  style="display: none;" />
          <br />
          <button id="editPolygon">Edit</button>
          <button id="deletePolygon">Delete</button>
        </div>
      `);

              // Calculate the centroid of the polygon
              const centroid = getPolygonCentroid(polygon_.getPath());

              // Set the position of the infoWindow to the centroid
              infoWindow.setPosition(centroid);
              infoWindow.open(map);

              // Add event listeners for the buttons
              window.google.maps.event.addListenerOnce(
                infoWindow,
                "domready",
                () => {
                  document
                    .getElementById("editPolygon")
                    .addEventListener("click", () => {
                      // Handle edit action
                      const newId = document.getElementById("polygonId").value;
                      console.log("Edit button clicked, new ID:", newId);
                      // Add your edit logic here, e.g., update the polygon ID in mainPolygons
                    });

                  document
                    .getElementById("deletePolygon")
                    .addEventListener("click", () => {
                      // Handle delete action
                      const newId = document.getElementById("polygonId").value;
                      console.log("Delete button clicked, new ID:", newId);
                      // Add your delete logic here, e.g., remove the polygon from mainPolygons
                    });
                }
              );
            } else {
              console.error("infoWindow is not defined");
            }
          });
          polygon_.setMap(map);
        } else {
          console.error("polygon_ or map is not defined");
        }

        // polygon_.addListener("dragend", () => {
        //   const updatedCoords = polygon_
        //     .getPath()
        //     .getArray()
        //     .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }));
        //   const lastItem = Object.assign({}, updatedCoords[0]); // create a copy of the first item
        //   updatedCoords.push(lastItem); // add the copy as the last item in the array
        //   // dispatch(setCreatedPolygon(updatedCoords));
        //   dispatch(addMainPolygon(updatedCoords));
        // });
        // polygon_.addListener("mouseup", () => {
        //   const updatedCoords = polygon_
        //     .getPath()
        //     .getArray()
        //     .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }));
        //   const lastItem = Object.assign({}, updatedCoords[0]); // create a copy of the first item
        //   updatedCoords.push(lastItem); // add the copy as the last item in the array
        //   dispatch(addMainPolygon(updatedCoords));
        // });
        polygon_.setMap(map);
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
