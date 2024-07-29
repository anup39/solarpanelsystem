import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  place: JSON.parse(localStorage.getItem("place")) || null,
  coordinates: JSON.parse(localStorage.getItem("coordinates")) || null,
  buildingInsights:
    JSON.parse(localStorage.getItem("buildingInsights")) || null,
  mainPolygons: [],
  keepOutPolygons: [],
  selectedPolygon: null,
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
    addMainPolygon: (state, action) => {
      state.mainPolygons.push(action.payload);
    },
    addKeepOutPolygon: (state, action) => {
      state.keepOutPolygons.push(action.payload);
    },
    setSelectedPolygon: (state, action) => {
      state.selectedPolygon = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const {
  setPlace,
  setCoordinates,
  setBuildingInsights,
  addMainPolygon,
  addKeepOutPolygon,
  setSelectedPolygon,
} = Map.actions;

export default Map.reducer;
