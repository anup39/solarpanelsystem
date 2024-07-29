import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showMapLoader: false,
};

export const MapView = createSlice({
  name: "MapView",
  initialState,
  reducers: {
    setshowMapLoader: (state, action) => {
      state.showMapLoader = action.payload;
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const { setshowMapLoader } = MapView.actions;

export default MapView.reducer;
