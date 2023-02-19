import { createSlice } from '@reduxjs/toolkit';

const orderStore = {
  order: {},
  orders: [],
  loading: false,
  orderLoading: true,
  loadingDeliver: false,
  successDeliver: false,
  error: '',
  errorDeliver: ''
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
    fetchSuccess(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: '',
        order: payload,
      }
    },
    fetchFail(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload,
      }
    },
    createOrderSuccess(state) {
      return {
        ...state,
        loading: false,
        error: ''
      };
    },
    fetchOrdersSuccess(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: '',
        orders: payload,
      }
    },
    createFail(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    },
    deliverRequest(state) {
      return {
        ...state,
        loadingDeliver: true
      }
    },
    deliverSuccess(state) {
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: true
      }
    },
    deliverFail(state, { payload }) {
      return {
        ...state,
        loadingDeliver: false,
        errorDeliver: payload
      }
    },
    deliverReset(state) {
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: ''
      }
    }
  },
});

export const {
  createRequest,
  createOrderSuccess,
  fetchSuccess,
  fetchOrdersSuccess,
  fetchFail,
  createFail,
  deliverRequest,
  deliverSuccess,
  deliverFail,
  deliverReset
} = orderSlice.actions;
export const selectOrder = (state) => state.orderStore;
export default orderSlice.reducer;
