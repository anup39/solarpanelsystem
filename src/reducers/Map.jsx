import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  place: JSON.parse(localStorage.getItem("place")) || null,
  coordinates: JSON.parse(localStorage.getItem("coordinates")) || null,
};

export const Map = createSlice({
  name: "Map",
  initialState,
  reducers: {
    setPlace: (state, action) => {
      console.log(action.payload);
      state.place = action.payload;
    },
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setPlace, setCoordinates } = Map.actions;

export default Map.reducer;
