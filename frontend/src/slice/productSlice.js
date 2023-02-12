import { createSlice } from '@reduxjs/toolkit';

const productStore = {
  product: {},
  loading: false,
  loadingUpload: false,
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
    uploadRequestProduct(state) {
      return {
        ...state,
        loadingUpload: true,
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
    uploadSuccessProduct(state, { payload }) {
      return {
        ...state,
        loadingUpload: false,
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
    uploadFailureProduct(state, { payload }) {
      return {
        ...state,
        loadingUpload: false,
        error: payload,
      };
    },
  },
});

export const {
  fetchRequestProduct,
  updateRequestProduct,
  uploadRequestProduct,
  fetchSuccessProduct,
  updateSuccessProduct,
  createSuccessProduct,
  uploadSuccessProduct,
  fetchFailureProduct,
  updateFailureProduct,
  uploadFailureProduct
} = productSlice.actions;
export const selectProduct = (state) => state.productStore;
export default productSlice.reducer;
