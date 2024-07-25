import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  place: JSON.parse(localStorage.getItem("place")) || null,
  coordinates: JSON.parse(localStorage.getItem("coordinates")) || null,
  buildingInsights:
    JSON.parse(localStorage.getItem("buildingInsights")) || null,

  createdPolygon: null,
};

export const Map = createSlice({
  name: "Map",
  initialState,
  reducers: {
    setPlace: (state, action) => {
      state.place = action.payload;
    },
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
    setBuildingInsights: (state, action) => {
      state.buildingInsights = action.payload;
    },
    setCreatedPolygon: (state, action) => {
      state.createdPolygon = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setPlace,
  setCoordinates,
  setBuildingInsights,
  setCreatedPolygon,
} = Map.actions;

export default Map.reducer;
