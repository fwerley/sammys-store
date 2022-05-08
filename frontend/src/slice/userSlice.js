import { createSlice } from '@reduxjs/toolkit';

const user = localStorage.getItem('userInfo');
const shpAddress = localStorage.getItem('shippingAddress');

const userStore = {
  userInfo: user ? JSON.parse(user) : null,
  shippingAddress: shpAddress ? JSON.parse(shpAddress) : {},
  loading: false,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: userStore,
  reducers: {
    userResquest(state) {
      return {
        ...state,
        loading: true,
      };
    },
    userSignin(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
        loading: false,
      };
    },
    userFailure(state, { payload }) {
      return {
        ...state,
        error: payload,
        loading: false,
      };
    },
    userSignout(state, { payload }) {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('shippingAddress');
      return {
        ...state,
        userInfo: null,
        shippingAddress: {},
      };
    },
    saveShippingAddress(state, { payload }) {
      localStorage.setItem('shippingAddress', JSON.stringify(payload));
      return {
        ...state,
        shippingAddress: payload,
      };
    },
  },
});

export const {
  userResquest,
  userSignin,
  userFailure,
  userSignout,
  saveShippingAddress,
} = userSlice.actions;
export const selectUser = (state) => state.userStore;
export default userSlice.reducer;
