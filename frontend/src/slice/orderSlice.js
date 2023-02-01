import { createSlice } from '@reduxjs/toolkit';

const orderStore = {
  order: {},
  orders: [],
  loading: false,
  orderLoading: true,
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
        error: ''
      };
    },
    createOrderSuccess(state) {
      return {
        ...state,
        loading: false,
        error: ''
      };
    },
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: '',
        order: payload,
      }
    },
    fetchOrdersSuccess(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: '',
        orders: payload,
      }
    },
    fetchFail(state, { payload }){
      return {
        ...state,
        loading: false,
        error: payload,
      }
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

export const { createRequest, createOrderSuccess, fetchSuccess, fetchOrdersSuccess, fetchFail, createFail } = orderSlice.actions;
export const selectOrder = (state) => state.orderStore;
export default orderSlice.reducer;
