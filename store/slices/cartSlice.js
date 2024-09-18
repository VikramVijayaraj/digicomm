import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToTotal(state, action) {
      const { productId, totalPrice } = action.payload;
      const existingProduct = state.items.find(
        (existingItem) => existingItem.productId === productId
      );

      if (existingProduct) {
        existingProduct.totalPrice = totalPrice;
      } else {
        state.items.push({ productId, totalPrice });
      }
    },
  },
});

export const { addToTotal } = cartSlice.actions;
export default cartSlice.reducer;
