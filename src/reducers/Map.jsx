import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  place: null,
  coordinates: null,
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
