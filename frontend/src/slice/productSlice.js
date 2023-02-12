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
    updateRequestProduct(state) {
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
    updateSuccessProduct(state, { payload }) {
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
    updateFailureProduct(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
  },
});

export const {
  fetchRequestProduct,
  updateRequestProduct,
  fetchSuccessProduct,
  updateSuccessProduct,
  createSuccessProduct,
  fetchFailureProduct,
  updateFailureProduct
} = productSlice.actions;
export const selectProduct = (state) => state.productStore;
export default productSlice.reducer;
