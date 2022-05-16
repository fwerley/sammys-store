import { createSlice } from '@reduxjs/toolkit';

const orderStore = {
  loading: false,
  error: '',
};

const orderSlice = createSlice({
  name: 'order',
  initialState: orderStore,
  reducers: {
    createRequest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    createSuccess(state) {
      return {
        ...state,
        loading: false,
      };
    },
    createFail(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
  },
});

export const { createRequest, createSuccess ,createFail } = orderSlice.actions;
export const selectOrder = (state) => state.orderStore;
export default orderSlice.reducer;
