import { configureStore } from '@reduxjs/toolkit';

import productsReducer from '../slice/productsSlice';
import productReducer from '../slice/productSlice';
import cartReducer from '../slice/cartSlice';
import userReducer from '../slice/userSlice';
import orderReducer from '../slice/orderSlice';
import paymentReducer from '../slice/paymentSlice';
import searchReducer from '../slice/searchSlice';
import dashboardReducer from '../slice/dashboardSlice';
import transactionReducer from '../slice/transactionSlice';

const reducers = {
  productsStore: productsReducer,
  productStore: productReducer,
  cartStore: cartReducer,
  userStore: userReducer,
  orderStore: orderReducer,
  paymentStore: paymentReducer,
  searchStore: searchReducer,
  dashboardStore: dashboardReducer,
  transactionStore: transactionReducer
};

const store = configureStore({ reducer: reducers });

export default store;
