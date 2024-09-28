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
        (existingItem) => existingItem.productId === productId,
      );

      if (existingProduct) {
        existingProduct.totalPrice = totalPrice;
      } else {
        state.items.push({ productId, totalPrice });
      }
    },
    removeFromTotal(state, action) {
      const { productId } = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
    },
  },
});

export const { addToTotal, removeFromTotal } = cartSlice.actions;
export default cartSlice.reducer;
