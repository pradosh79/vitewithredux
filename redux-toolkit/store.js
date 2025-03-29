import { configureStore } from "@reduxjs/toolkit";
import authSlices from "./Slice/auth.slice";
import { cmsSlice } from "./Slice/cms.slice";

export const store = configureStore({
  reducer: {
    Auth: authSlices,
    cms: cmsSlice.reducer
  },
});
