import { createSlice } from '@reduxjs/toolkit';

const productStore = {
  product: {},
  loading: false,
  error: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState: productStore,
  reducers: {
    fetchRequestProduct(state) {
      return {
        ...state,
        loading: true,
      };
    },
    fetchSuccessProduct(state, { payload }) {
      return {
        ...state,
        product: payload,
        loading: false,
      };
    },
    createSuccessProduct(state, { payload }) {
      return {
        ...state,
        product: payload.product,
        loading: false,
      };
    },
    fetchFailureProduct(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
  },
});

export const { fetchRequestProduct, fetchSuccessProduct, createSuccessProduct, fetchFailureProduct } =
  productSlice.actions;
export const selectProduct = (state) => state.productStore;
export default productSlice.reducer;
