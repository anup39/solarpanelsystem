import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showMapLoader: false,
  maingeojosn: {
    type: "FeatureCollection",
    features: [],
  },
  keepoutgeojson: {
    type: "FeatureCollection",
    features: [],
  },
};

export const MapView = createSlice({
  name: "MapView",
  initialState,
  reducers: {
    setshowMapLoader: (state, action) => {
      state.showMapLoader = action.payload;
    },
    editGeojson: (state, action) => {
      state.maingeojosn = action.payload;
    },
    editGeojsonKeepout: (state, action) => {
      state.keepoutgeojson = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setshowMapLoader, editGeojson, editGeojsonKeepout } =
  MapView.actions;

export default MapView.reducer;
