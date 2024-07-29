import { Tooltip, IconButton } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import {
  setshowToast,
  settoastMessage,
  settoastType,
} from "../../reducers/DisplaySettings";
import { useDispatch, useSelector } from "react-redux";
import { setshowMapLoader } from "../../reducers/MapView";
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

  const handleSave = useCallback(() => {
    if (
      wkt_geometry &&
      type_of_geometry &&
      id &&
      view_name &&
      mode &&
      component
    ) {
      // dispatch(setshowGeomFormPopup("block"));
      if (mode === "Draw") {
        console.log("Draw mode");
        dispatch(setshowMapLoader(true));
        //             dispatch(setshowToast(true));
        //             dispatch(settoastType("success"));
        //             dispatch(
        //               settoastMessage(
        //                 `Successfully created the Category ${view_name}`
        //               )
        //             );
        //             setTimeout(() => {
        //               dispatch(setshowMapLoader(false));
        //               if (window.map_global) {
        //                 const sourceId =
        //                   String(currentClient) + view_name + "source";
        //                 const layerId =
        //                   String(currentClient) + view_name + "layer";
        //                 const map = window.map_global;
        //                 if (map.getSource(sourceId) && map.getLayer(layerId)) {
        //                   const source = map.getSource(sourceId);
        //                   source.setData(
        //                     `${
        //                       import.meta.env.VITE_API_DASHBOARD_URL
        //                     }/category-point-geojson/?project=${currentProject}&category=${id}`
        //                   );
        //                 }
        //                 const drawInstance = window.map_global.draw;
        //                 drawInstance.deleteAll();
        //                 drawInstance.changeMode("simple_select");
        //                 dispatch(setWKTGeometry(null));
        //                 dispatch(setTypeOfGeometry(null));
        //                 dispatch(setId(null));
        //                 dispatch(setViewName(null));
        //                 dispatch(setMode(null));
        //                 dispatch(setFeatureId(null));
        //                 dispatch(setComponent(null));
        //               }
        //             }, 3000);
        //           })
        //           .catch(() => {
        //             dispatch(setshowToast(true));
        //             dispatch(settoastType("error"));
        //             dispatch(settoastMessage("Failed to create the Category"));
        //             setTimeout(() => {
        //               dispatch(setshowMapLoader(false));
        //               if (window.map_global) {
        //                 const drawInstance = window.map_global.draw;
        //                 drawInstance.deleteAll();
        //                 drawInstance.changeMode("simple_select");
        //                 dispatch(setWKTGeometry(null));
        //                 dispatch(setTypeOfGeometry(null));
        //                 dispatch(setId(null));
        //                 dispatch(setViewName(null));
        //                 dispatch(setMode(null));
        //                 dispatch(setFeatureId(null));
        //                 dispatch(setComponent(null));
        //               }
        //             }, 3000);
        //           });
        //       }
      } else {
        console.log("Edit mode");
        dispatch(setshowMapLoader(true));
        const data = {
          geom: wkt_geometry,
        };

        //       dispatch(setshowToast(true));
        //       dispatch(settoastType("success"));
        //       dispatch(
        //         settoastMessage(
        //           `Successfully updated the Category ${view_name}`
        //         )
        //       );
        //       setTimeout(() => {
        //         dispatch(setshowMapLoader(false));
        //         if (window.map_global) {
        //           const sourceId = String(currentClient) + view_name + "source";
        //           const layerId = String(currentClient) + view_name + "layer";
        //           const map = window.map_global;
        //           if (map.getSource(sourceId) && map.getLayer(layerId)) {
        //             const source = map.getSource(sourceId);
        //             source.setData(
        //               `${
        //                 import.meta.env.VITE_API_DASHBOARD_URL
        //               }/category-point-geojson/?project=${currentProject}&category=${id}`
        //             );
        //           }
        //           if (mode === "Edit") {
        //             map.setFilter(layerId, null);
        //           }
        //           const drawInstance = window.map_global.draw;
        //           drawInstance.deleteAll();
        //           drawInstance.changeMode("simple_select");
        //           dispatch(setWKTGeometry(null));
        //           dispatch(setTypeOfGeometry(null));
        //           dispatch(setId(null));
        //           dispatch(setViewName(null));
        //           dispatch(setMode(null));
        //           dispatch(setFeatureId(null));
        //           dispatch(setComponent(null));
        //         }
        //       }, 3000);
        //     })
        //     .catch(() => {
        //       dispatch(setshowToast(true));
        //       dispatch(settoastType("error"));
        //       dispatch(settoastMessage("Failed to update the Category"));
        //       setTimeout(() => {
        //         dispatch(setshowMapLoader(false));
        //         if (window.map_global) {
        //           const drawInstance = window.map_global.draw;
        //           drawInstance.deleteAll();
        //           drawInstance.changeMode("simple_select");
        //           dispatch(setWKTGeometry(null));
        //           dispatch(setTypeOfGeometry(null));
        //           dispatch(setId(null));
        //           dispatch(setViewName(null));
        //           dispatch(setMode(null));
        //           dispatch(setFeatureId(null));
        //           dispatch(setComponent(null));
        //         }
        //       }, 3000);
        //     });
        // }
      }
    } else {
      dispatch(setshowToast(true));
      dispatch(settoastType("error"));
      dispatch(settoastMessage(`Nothing is drawn in map`));
    }
  }, [
    component,
    dispatch,
    // feature_id,
    id,
    mode,
    // popUpRef,
    type_of_geometry,
    view_name,
    wkt_geometry,
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
