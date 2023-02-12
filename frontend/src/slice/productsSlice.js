import { createSlice } from '@reduxjs/toolkit';
import { shuffle } from '../utils';

const productsStore = {
  products: [],
  pages: 1,
  loading: false,
  error: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState: productsStore,
  reducers: {
    fetchRequest(state) {
      return {
        ...state,
        loading: true,
        error: ''
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        products: shuffle(payload.products),
        loading: false,
      };
    },
    fetchListProductsSuccess(state, { payload }) {
      return {
        ...state,
        products: payload.products,  
        pages: payload.pages,        
        loading: false,
      };
    },
    fetchFailure(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
  },
});

export const { fetchRequest, fetchSuccess, fetchListProductsSuccess, fetchFailure } =
  productsSlice.actions;
export const selectProducts = (state) => state.productsStore;
export default productsSlice.reducer;
