import { createSlice } from '@reduxjs/toolkit';

const orderStore = {
  order: {},
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
    fetchSuccess(state, {payload}){
      return {
        ...state,
        loading: false,
        error: '',
        order: payload,
      }
    },
    createFail(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
    // addTaxPrice(state, {payload}) {
    //   return {
    //     ...state,
    //     ...order,
    //     taxPrice: payload
    //   }
    // }
  },
});

export const { createRequest, createOrderSuccess, fetchSuccess, createFail } = orderSlice.actions;
export const selectOrder = (state) => state.orderStore;
export default orderSlice.reducer;
