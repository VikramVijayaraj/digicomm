import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticateUser(state, action) {
      console.log("Previous state:", state);
      console.log("Increment by:", action.payload);
      state = action.payload;
    },
  },
});

export const { authenticateUser } = authSlice.actions;
export default authSlice.reducer;
