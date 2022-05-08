import { createSlice } from '@reduxjs/toolkit';

const shpAddress = localStorage.getItem('shippingAddress');
const itsCarts = localStorage.getItem('cartItems');

const cartState = {
  cart: {
    cartItems: itsCarts ? JSON.parse(itsCarts) : [],
    shippingAddress: shpAddress ? JSON.parse(shpAddress) : {},
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: cartState,
  reducers: {
    addCartItem(state, { payload }) {
      //add to cart
      const newItem = payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.id === newItem.id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.id === existItem.id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    },
    cartRemoveItem(state, { payload }) {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.id !== payload.id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    },
    saveShippingAddress(state, { payload }) {
      localStorage.setItem('shippingAddress', JSON.stringify(payload));
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: payload,
        },
      };
    },
  },
});

export const { addCartItem, cartRemoveItem, saveShippingAddress } =
  cartSlice.actions;
export const selectCart = (state) => state.cartStore;
export default cartSlice.reducer;
