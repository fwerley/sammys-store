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
    fetchRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        product: payload,
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

export const { fetchRequest, fetchSuccess, fetchFailure } =
  productSlice.actions;
export const selectProduct = (state) => state.productStore;
export default productSlice.reducer;
