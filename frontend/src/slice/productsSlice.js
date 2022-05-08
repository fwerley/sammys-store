import { createSlice } from '@reduxjs/toolkit';

const productsStore = {
  products: [],
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
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        products: payload,
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
  productsSlice.actions;
export const selectProducts = (state) => state.productsStore;
export default productsSlice.reducer;
