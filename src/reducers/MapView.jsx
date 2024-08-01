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
  showCalculate: true,
  solar_details: null,
  api_details: null,
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
    setShowCalculate: (state, action) => {
      state.showCalculate = action.payload;
    },
    setSolarDetails: (state, action) => {
      state.solar_details = action.payload;
    },
    setApiDetails: (state, action) => {
      state.api_details = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setshowMapLoader,
  editGeojson,
  editGeojsonKeepout,
  setShowCalculate,
  setSolarDetails,
  setApiDetails,
} = MapView.actions;

export default MapView.reducer;
