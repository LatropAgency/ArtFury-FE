import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: JSON.parse(localStorage.getItem("user")),
  },
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    removeUser: (state) => {
      state.value = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export const selectUser = (state) => state.user.value;

export default userSlice.reducer;
