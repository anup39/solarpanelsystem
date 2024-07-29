import { Tooltip, IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import { editGeojsonKeepout, setshowMapLoader } from "../../reducers/MapView";
import axios from "axios";
import {
  setId,
  setViewName,
  setTypeOfGeometry,
  setWKTGeometry,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";
import AddLayerAndSourceToMap from "../../maputils/AddLayerAndSourceToMap";
import PropTypes from "prop-types";
import { useEffect, useCallback } from "react";
import { setShowKeyInfo } from "../../reducers/DrawnGeometry";
import { editGeojson } from "../../reducers/MapView";
import createSmallPolygons from "../../maputils/AddSmallPolygons";

export default function Save({ popUpRef }) {
  const dispatch = useDispatch();
  const wkt_geometry = useSelector((state) => state.drawnPolygon.wkt_geometry);
  const type_of_geometry = useSelector(
    (state) => state.drawnPolygon.type_of_geometry
  );
  const id = useSelector((state) => state.drawnPolygon.id);
  const feature_id = useSelector((state) => state.drawnPolygon.feature_id);
  const view_name = useSelector((state) => state.drawnPolygon.view_name);
  const mode = useSelector((state) => state.drawnPolygon.mode);
  const component = useSelector((state) => state.drawnPolygon.component);
  const mapgeojson = useSelector((state) => state.mapView.maingeojosn);
  const keepoutgeojson = useSelector((state) => state.mapView.keepoutgeojson);
  console.log(mapgeojson, "mapgeojson");

  const handleSave = useCallback(() => {
    console.log("Save");
    console.log(wkt_geometry, "wkt_geometry");
    console.log(type_of_geometry, "type_of_geometry");
    console.log(id, "id");
    console.log(view_name, "view_name");
    console.log(mode, "mode");
    console.log(component, "component");
    if (
      wkt_geometry &&
      type_of_geometry &&
      String(id) &&
      view_name &&
      mode &&
      component
    ) {
      console.log("Save");
      // dispatch(setshowGeomFormPopup("block"));
      if (mode === "Draw") {
        console.log("Draw mode");
        dispatch(setshowMapLoader(true));
        setTimeout(() => {
          dispatch(setshowMapLoader(false));
          if (window.map_global) {
            const sourceId = view_name + "source";
            const layerId = view_name + "layer";
            const map = window.map_global;
            if (map.getSource(sourceId) && map.getLayer(layerId)) {
              console.log("source and layer exists");
              const source = map.getSource(sourceId);
              if (view_name === "Main") {
                const deepcopy = {
                  ...mapgeojson,
                  features: mapgeojson.features.map((feature) => ({
                    ...feature,
                    geometry: { ...feature.geometry },
                    properties: { ...feature.properties },
                  })),
                };
                // Push the new feature into the features array
                deepcopy.features.push({
                  type: "Feature",
                  properties: {
                    centriod: "45,23",
                    area: 234,
                    component: component,
                    type_of_geometry: type_of_geometry,
                    view_name: view_name,
                  },
                  geometry: {
                    coordinates: wkt_geometry,
                    type: type_of_geometry,
                  },
                  id: mapgeojson.features.length,
                });

                // Log the updated features array
                console.log(deepcopy.features, "features");

                // Create the new GeoJSON object
                const newgeojson = {
                  type: "FeatureCollection",
                  features: deepcopy.features,
                };
                console.log(newgeojson, "newgeojson");

                source.setData(newgeojson);
                // createSmallPolygons({
                //   map: map,
                //   mainPolygon: newgeojson,
                //   height: 0.01,
                //   width: 0.01,
                // });
                dispatch(editGeojson(newgeojson));
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(settoastMessage(`Successfully created  ${view_name}`));
              }
              if (view_name === "Keepout") {
                console.log("Keepout");
                const deepcopy = {
                  ...keepoutgeojson,
                  features: keepoutgeojson.features.map((feature) => ({
                    ...feature,
                    geometry: { ...feature.geometry },
                    properties: { ...feature.properties },
                  })),
                };
                // Push the new feature into the features array
                deepcopy.features.push({
                  type: "Feature",
                  properties: {
                    centriod: "45,23",
                    area: 234,
                    component: component,
                    type_of_geometry: type_of_geometry,
                    view_name: view_name,
                  },
                  geometry: {
                    coordinates: wkt_geometry,
                    type: type_of_geometry,
                  },
                  id: keepoutgeojson.features.length,
                });

                // Create the new GeoJSON object
                const newgeojson = {
                  type: "FeatureCollection",
                  features: deepcopy.features,
                };
                console.log(newgeojson, "newgeojson");

                source.setData(newgeojson);
                dispatch(editGeojsonKeepout(newgeojson));
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(settoastMessage(`Successfully created  ${view_name}`));
              }
            }
            const drawInstance = window.map_global.draw;
            drawInstance.deleteAll();
            drawInstance.changeMode("simple_select");
            dispatch(setWKTGeometry(null));
            dispatch(setTypeOfGeometry(null));
            dispatch(setId(null));
            dispatch(setViewName(null));
            dispatch(setMode(null));
            dispatch(setFeatureId(null));
            dispatch(setComponent(null));
          }
        }, 3000);
      } else {
        console.log("Edit mode");
        dispatch(setshowMapLoader(true));
        setTimeout(() => {
          dispatch(setshowMapLoader(false));
          if (window.map_global) {
            const sourceId = view_name + "source";
            const layerId = view_name + "layer";
            const map = window.map_global;
            if (map.getSource(sourceId) && map.getLayer(layerId)) {
              const source = map.getSource(sourceId);
              if (view_name === "Main") {
                const deepcopy = JSON.parse(JSON.stringify(mapgeojson));
                const features = deepcopy.features.map((feature) => {
                  if (feature.id === feature_id) {
                    feature.geometry.coordinates = wkt_geometry;
                  }
                  return feature;
                });
                const newgeojson = {
                  type: "FeatureCollection",
                  features: features,
                };
                source.setData(newgeojson);
                dispatch(editGeojson(newgeojson));
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(settoastMessage(`Successfully updated  ${view_name}`));
              }
              if (view_name === "Keepout") {
                const deepcopy = JSON.parse(JSON.stringify(keepoutgeojson));
                const features = deepcopy.features.map((feature) => {
                  if (feature.id === feature_id) {
                    feature.geometry.coordinates = wkt_geometry;
                  }
                  return feature;
                });

                const newgeojson = {
                  type: "FeatureCollection",
                  features: features,
                };
                source.setData(newgeojson);
                dispatch(editGeojsonKeepout(newgeojson));
                dispatch(setshowToast(true));
                dispatch(settoastType("success"));
                dispatch(settoastMessage(`Successfully updated  ${view_name}`));
              }
            }
            if (mode === "Edit") {
              map.setFilter(layerId, null);
            }
            const drawInstance = window.map_global.draw;
            drawInstance.deleteAll();
            drawInstance.changeMode("simple_select");
            dispatch(setWKTGeometry(null));
            dispatch(setTypeOfGeometry(null));
            dispatch(setId(null));
            dispatch(setViewName(null));
            dispatch(setMode(null));
            dispatch(setFeatureId(null));
            dispatch(setComponent(null));
          }
        }, 3000);
      }
    } else {
      dispatch(setshowToast(true));
      dispatch(settoastType("error"));
      dispatch(settoastMessage(`Nothing is drawn in map`));
    }
  }, [
    component,
    dispatch,
    feature_id,
    id,
    mode,
    // popUpRef,
    type_of_geometry,
    view_name,
    wkt_geometry,
    mapgeojson,
    keepoutgeojson,
  ]);

  useEffect(() => {
    const map = window.map_global;
    if (map) {
      const keyDownHandler = (e) => {
        console.log(e.key);
        if (e.key === "Enter") {
          handleSave();
          dispatch(setShowKeyInfo(false));
        }
      };
      window.addEventListener("keydown", keyDownHandler);
      return () => {
        window.removeEventListener("keydown", keyDownHandler);
      };
    }
  }, [handleSave, dispatch]);

  return (
    <div>
      <Tooltip title={"Save"}>
        <IconButton
          onClick={handleSave}
          id="save-draw"
          sx={{
            "&:hover": { cursor: "pointer" },
            color: "#d61b60",
          }}
          aria-label="Save"
        >
          <DoneIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}

Save.propTypes = {
  popUpRef: PropTypes.object,
};
