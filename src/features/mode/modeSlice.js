import { createSlice } from "@reduxjs/toolkit";

export const modeSlice = createSlice({
  name: "mode",
  initialState: {
    value: localStorage.getItem("mode") || 'customer',
  },
  reducers: {
    setMode: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("mode", action.payload);
    },
    switchMode: (state) => {
      state.value = (state.value === "customer") ? "handler" : "customer";
      localStorage.setItem("mode", state.value);
    },
  },
});

export const { setMode, switchMode } = modeSlice.actions;

export const selectMode = (state) => state.mode.value;

export default modeSlice.reducer;
