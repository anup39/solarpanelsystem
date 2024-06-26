import { configureStore } from "@reduxjs/toolkit";
import DisplaySettings from "./reducers/DisplaySettings";
import Auth from "./reducers/Auth";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    displaySettings: DisplaySettings,
    auth: Auth,
  },
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
