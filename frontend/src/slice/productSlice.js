import { createSlice } from '@reduxjs/toolkit';

const productStore = {
  product: {},
  loading: false,
  loadingUpload: false,
  loadingDelete: false,
  successDelete: false,
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
        error: ''
      };
    },
    fetchSuccessProduct(state, { payload }) {
      return {
        ...state,
        product: payload,
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
    updateRequestProduct(state) {
      return {
        ...state,
        loading: true,
      };
    },
    updateSuccessProduct(state, { payload }) {
      return {
        ...state,
        product: payload,
        loading: false,
      };
    },
    updateFailureProduct(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
    uploadRequestProduct(state) {
      return {
        ...state,
        loadingUpload: true,
      };
    },
    uploadSuccessProduct(state, { payload }) {
      return {
        ...state,
        loadingUpload: false,
      };
    },
    uploadFailureProduct(state, { payload }) {
      return {
        ...state,
        loadingUpload: false,
        error: payload,
      };
    },
    deleteRequestProduct(state) {
      return {
        ...state,
        loadingDelete: true,
      };
    },
    deleteSuccessProduct(state) {
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    },
    deleteFailureProduct(state, { payload }) {
      return {
        ...state,
        loadingDelete: false,
        error: payload
      };
    },
    deleteResetProduct(state, { payload }) {
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
        error: ''
      };
    },
    createSuccessProduct(state, { payload }) {
      return {
        ...state,
        product: payload.product,
        loading: false,
      };
    }
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
  uploadFailureProduct,
  deleteRequestProduct,
  deleteSuccessProduct,
  deleteFailureProduct,
  deleteResetProduct
} = productSlice.actions;
export const selectProduct = (state) => state.productStore;
export default productSlice.reducer;
