import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, IconButton } from "@mui/material";
import axios from "axios";
// import { setshowMapLoader } from "../../reducers/MapView";
// import {
//   setId,
//   setViewName,
//   setTypeOfGeometry,
//   setWKTGeometry,
//   setMode,
//   setFeatureId,
//   setComponent,
// } from "../../reducers/DrawnGeometry";
import { RootState } from "../../store";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Link, Typography } from "@mui/material";
import React from "react";

declare global {
  interface Window {
    map_global: any;
  }
}

interface PopupProps {
  properties: {
    [key: string]: string | number;
    id: number;
  };
  feature_id: number;
  features: any;
}

const Popup = ({ properties, feature_id, features }: PopupProps) => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAdditional, setLoadingAdditional] = useState(false);

  const dispatch = useDispatch();
  // const state = useSelector((state) => state.drawnPolygon);
  //   const id = useSelector((state: RootState) => state.drawnPolygon.id);
  const propertyElements = properties
    ? Object.entries(properties).map(([key, value]) => {
        return (
          <div key={key}>
            <>
              <strong>{key}:</strong> {value}
            </>
          </div>
        );
      })
    : null;

  const handleDeleteCategory = (properties, feature_id) => {
    // dispatch(setshowMapLoader(true));
    if (properties.type_of_geometry === "Polygon") {
      //   axios
      //     .delete(
      //       `${
      //         import.meta.env.VITE_API_DASHBOARD_URL
      //       }/polygon-data/${feature_id}/`
      //     )
      //     .then((res) => {
      //       dispatch(setshowMapLoader(false));
      //       const sourceId = String(client_id) + properties.view_name + "source";
      //       const layerId = String(client_id) + properties.view_name + "layer";
      //       const map = window.map_global;
      //       if (map.getSource(sourceId) && map.getLayer(layerId)) {
      //         const source = map.getSource(sourceId);
      //         const popups = document.getElementsByClassName("maplibregl-popup");
      //         if (popups.length) {
      //           popups[0].remove();
      //         }
      //         source.setData(
      //           `${
      //             import.meta.env.VITE_API_DASHBOARD_URL
      //           }/category-polygon-geojson/?project=${project_id}&category=${
      //             properties.category_id
      //           }`
      //         );
      //       }
      //     });
    }
  };
  const handleEditCategory = () => {
    // First remove the popup content
    // const popups = document.getElementsByClassName("maplibregl-popup");
    // if (popups.length) {
    //   popups[0].remove();
    // }
    // // Here now get the map object and then get the draw object and delete all the layers in draw and add the current features to the draw object
    // const map = window.map_global;
    // const draw = map.draw;
    // draw.deleteAll();
    // draw.add(features[0]);
    // // Here setting the state of the draw object in drawPolygon
    // dispatch(setWKTGeometry(null));
    // dispatch(setTypeOfGeometry(null));
    // dispatch(setMode("Edit"));
    // dispatch(setFeatureId(feature_id));
    // dispatch(setComponent(properties.component));
    // dispatch(setViewName(properties.view_name));
    // if (properties.component === "category") {
    //   dispatch(setId(properties.category_id));
    // } else {
    //   dispatch(setId(properties.project_id));
    // }
    // //Note: Here i have to find if the clicked featue is of category or project
    // if (view_name) {
    //   const layerId = String(client_id) + view_name + "layer";
    //   map.setFilter(layerId, null);
    // }
    // const layerId = String(client_id) + properties.view_name + "layer";
    // map.setFilter(layerId, null);
    // const layer = map.getLayer(layerId);
    // const existingFilter = layer.filter || ["all"];
    // const filterCondition = ["!=", ["id"], feature_id];
    // const updatedFilter = ["all", existingFilter, filterCondition];
    // map.setFilter(layerId, updatedFilter);
    // Loop through the elements and hide them
  };

  console.log(properties, "properties");

  return (
    <>
      {properties ? (
        <div>
          <div>{propertyElements}</div>
          <br></br>
          <div style={{ display: "flex", gap: 15, marginTop: 10 }}>
            <Button
              size="small"
              sx={{
                backgroundColor: "#D51B60",
                color: "white",
                "&:hover": {
                  backgroundColor: "black",
                },
              }}
              onClick={() => handleDeleteCategory(properties, feature_id)}
            >
              Delete
            </Button>
            <Button
              size="small"
              sx={{
                backgroundColor: "#D51B60",
                color: "white",

                "&:hover": {
                  backgroundColor: "black",
                },
              }}
              onClick={() => handleEditCategory()}
            >
              Edit
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Popup;
