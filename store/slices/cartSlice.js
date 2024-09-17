import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const { productSlug, quantity } = action.payload;
      console.log(action.payload);
      state.items.push({ productSlug, quantity });
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
