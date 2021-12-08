import { createSlice } from "@reduxjs/toolkit";

export const refreshTokenSlice = createSlice({
  name: "refreshToken",
  initialState: {
    value: localStorage.getItem("refreshToken"),
  },
  reducers: {
    setRefreshToken: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("refreshToken", action.payload);
    },
    removeRefreshToken: (state) => {
      state.value = null;
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setRefreshToken, removeRefreshToken } = refreshTokenSlice.actions;

export const selectRefreshToken = (state) => state.refreshToken.value;

export default refreshTokenSlice.reducer;
