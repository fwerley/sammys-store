import { createSlice } from '@reduxjs/toolkit';

const itsCarts = localStorage.getItem('cart');
const pymtMethod = localStorage.getItem('paymentMethod');

const cartStore = {
  cart: itsCarts ? JSON.parse(itsCarts) : [],
  seller: {},
  itemsPrice: null,
  shippingPrice: null,
  totalPrice: null,
  paymentMethod: pymtMethod ? JSON.parse(pymtMethod) : 'Cartao',
  paymentData: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: cartStore,
  reducers: {
    addCartItem(state, { payload }) {
      //add to cart
      const newItem = payload;
      const existItem = state.cart.find((item) => item.id === newItem.id);
      const cartItems = existItem
        ? state.cart.map((item) => (item.id === existItem.id ? newItem : item))
        : [...state.cart, newItem];
      localStorage.setItem('cart', JSON.stringify(cartItems));
      return {
        ...state,
        cart: cartItems,
      };
    },
    cartRemoveItem(state, { payload }) {
      const cartItems = state.cart.filter((item) => item.id !== payload.id);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      return {
        ...state,
        cart: cartItems,
      };
    },
    addSeller(state, { payload }) {
      localStorage.setItem('seller', JSON.stringify(payload));
      return {
        ...state,
        seller: payload
      }
    },
    cartPaymentMethod(state, { payload }) {
      localStorage.setItem('paymentMethod', JSON.stringify(payload));
      return {
        ...state,
        paymentMethod: payload,
      };
    },
    cartPaymentData(state, { payload }) {
      return {
        ...state,
        paymentData: payload,
      };
    },
    cartDelete(state) {
      localStorage.removeItem('cart');
      localStorage.removeItem('seller');
      localStorage.removeItem('paymentMethod');
      return {
        ...state,
        cart: [],
        paymentMethod: '',
        seller: {}
      };
    }
  },
});

export const { addCartItem, cartRemoveItem, addSeller, cartPaymentMethod, cartPaymentData, cartDelete } =
  cartSlice.actions;
export const selectCart = (state) => state.cartStore;
export default cartSlice.reducer;
