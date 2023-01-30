import { configureStore } from '@reduxjs/toolkit';

import productsReducer from '../slice/productsSlice';
import productReducer from '../slice/productSlice';
import cartReducer from '../slice/cartSlice';
import userReducer from '../slice/userSlice';
import orderReducer from '../slice/orderSlice';
import paymentReducer from '../slice/paymentSlice';

const reducers = {
  productsStore: productsReducer,
  productStore: productReducer,
  cartStore: cartReducer,
  userStore: userReducer,
  orderStore: orderReducer,
  paymentStore: paymentReducer
};

const store = configureStore({ reducer: reducers });

export default store;
