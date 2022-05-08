import { configureStore } from '@reduxjs/toolkit';
// import {
//   cartReducer,
//   productReducer,
//   productsReducer,
//   userReducer,
// } from '../reducers';
import productsReducer from '../slice/productsSlice';
import productReducer from '../slice/productSlice';
import cartReducer from '../slice/cartSlice';
import userReducer from '../slice/userSlice';

const reducers = {
  productsStore: productsReducer,
  productStore: productReducer,
  cartStore: cartReducer,
  userStore: userReducer,
};

const store = configureStore({ reducer: reducers });

export default store;
