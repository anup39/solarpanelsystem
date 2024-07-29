import { Tooltip, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  setId,
  setTypeOfGeometry,
  setWKTGeometry,
  setViewName,
  setMode,
  setFeatureId,
  setComponent,
} from "../../reducers/DrawnGeometry";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import { setShowKeyInfo } from "../../reducers/DrawnGeometry";

export default function Cancel() {
  const dispatch = useDispatch();

  const view_name = useSelector((state) => state.drawnPolygon.view_name);
  const mode = useSelector((state) => state.drawnPolygon.mode);

  const handleCancelDraw = useCallback(() => {
    if (window.map_global) {
      const draw = window.map_global.draw;

      if (mode === "Edit") {
        const layerId = view_name + "layer";
        window.map_global.setFilter(layerId, null);
        console.log(window.map_global, "map global");
      }
      draw.deleteAll();
      draw.changeMode("simple_select");
      console.log(window.map_global, "map global");
      dispatch(setWKTGeometry(null));
      dispatch(setTypeOfGeometry(null));
      dispatch(setId(null));
      dispatch(setViewName(null));
      dispatch(setMode(null));
      dispatch(setFeatureId(null));
      dispatch(setComponent(null));
    }
  }, [dispatch, mode, view_name]);

  useEffect(() => {
    const map = window.map_global;
    if (map) {
      const keyDownHandler = (e) => {
        console.log(e.key);
        if (e.key === "Escape") {
          handleCancelDraw();
          dispatch(setShowKeyInfo(false));
        }
      };
      window.addEventListener("keydown", keyDownHandler);
      return () => {
        window.removeEventListener("keydown", keyDownHandler);
      };
    }
  }, [handleCancelDraw, dispatch]);

  return (
    <div>
      <Tooltip title={"Cancel"}>
        <IconButton
          onClick={handleCancelDraw}
          id="cancel-draw"
          sx={{
            "&:hover": { cursor: "pointer" },
            color: "#d61b60",
          }}
          aria-label="Cancel"
        >
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
