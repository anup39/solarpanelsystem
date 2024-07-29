import { useDispatch, useSelector } from "react-redux";
import { Button, Icon, IconButton } from "@mui/material";
import axios from "axios";
import {
  editGeojson,
  editGeojsonKeepout,
  setshowMapLoader,
} from "../../reducers/MapView";
import {
  setId,
  setViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";
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
  const view_name = useSelector(
    (state: RootState) => state.drawnPolygon.view_name
  );

  const dispatch = useDispatch();
  // const state = useSelector((state) => state.drawnPolygon);
  //   const id = useSelector((state: RootState) => state.drawnPolygon.id);
  const maingeojson = useSelector(
    (state: RootState) => state.mapView.maingeojosn
  );
  const keepoutgeojson = useSelector(
    (state: RootState) => state.mapView.keepoutgeojson
  );
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
    dispatch(setshowMapLoader(true));
    if (properties.type_of_geometry === "Polygon") {
      const sourceId = properties.view_name + "source";
      const layerId = properties.view_name + "layer";
      if (properties.view_name === "Keepout") {
        const deepcopy = {
          ...keepoutgeojson,
          features: keepoutgeojson.features.map((feature) => ({
            ...feature,
            geometry: { ...feature.geometry },
            properties: { ...feature.properties },
          })),
        };

        const index = deepcopy.features.findIndex(
          (feature) => feature.id === feature_id
        );
        deepcopy.features.splice(index, 1);
        const map = window.map_global;
        if (map.getSource(sourceId) && map.getLayer(layerId)) {
          const source = map.getSource(sourceId);
          const popups = document.getElementsByClassName("maplibregl-popup");
          if (popups.length) {
            popups[0].remove();
          }
          source.setData(deepcopy);
          dispatch(editGeojsonKeepout(deepcopy));
        }
        dispatch(setshowMapLoader(false));
      } else if (properties.view_name === "Main") {
        const deepcopy = {
          ...maingeojson,
          features: maingeojson.features.map((feature) => ({
            ...feature,
            geometry: { ...feature.geometry },
            properties: { ...feature.properties },
          })),
        };

        const index = deepcopy.features.findIndex(
          (feature) => feature.id === feature_id
        );
        deepcopy.features.splice(index, 1);
        const map = window.map_global;
        if (map.getSource(sourceId) && map.getLayer(layerId)) {
          const source = map.getSource(sourceId);
          const popups = document.getElementsByClassName("maplibregl-popup");
          if (popups.length) {
            popups[0].remove();
          }
          source.setData(deepcopy);
          dispatch(editGeojson(deepcopy));
        }
        dispatch(setshowMapLoader(false));
      }
    }
  };
  const handleEditCategory = () => {
    console.log(feature_id, "feature_id");
    console.log("Edit");
    // First remove the popup content
    const popups = document.getElementsByClassName("maplibregl-popup");
    if (popups.length) {
      popups[0].remove();
    }
    // Here now get the map object and then get the draw object and delete all the layers in draw and add the current features to the draw object
    const map = window.map_global;
    const draw = map.draw;
    draw.deleteAll();
    draw.add(features[0]);
    // Here setting the state of the draw object in drawPolygon
    dispatch(setWKTGeometry(null));
    dispatch(setTypeOfGeometry(null));
    dispatch(setMode("Edit"));
    dispatch(setFeatureId(feature_id));
    dispatch(setComponent(properties.component));
    dispatch(setViewName(properties.view_name));
    if (properties.component === "category") {
      dispatch(setId(feature_id));
    }
    //Note: Here i have to find if the clicked featue is of category or project
    console.log(properties, "properties");
    console.log(view_name, "view_name");
    if (view_name) {
      const layerId = view_name + "layer";
      map.setFilter(layerId, null);
    }
    const layerId = properties.view_name + "layer";
    console.log(layerId, "layerId");
    map.setFilter(layerId, null);
    const layer = map.getLayer(layerId);
    const existingFilter = layer.filter || ["all"];
    const filterCondition = ["!=", ["id"], feature_id];
    const updatedFilter = ["all", existingFilter, filterCondition];
    map.setFilter(layerId, updatedFilter);
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
