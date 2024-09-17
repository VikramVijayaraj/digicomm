import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./slices/cartSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
  });
}

export const store = makeStore();
