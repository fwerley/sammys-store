import { createSlice } from '@reduxjs/toolkit';

const user = localStorage.getItem('userInfo');
const shpAddress = localStorage.getItem('shippingAddress');

const userStore = {
  users: [],
  userInfo: user ? JSON.parse(user) : null,
  shippingAddress: shpAddress ? JSON.parse(shpAddress) : {},
  loading: false,
  loadingUpdate: false,
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
        error: ''
      };
    },
    userUpdateResquest(state) {
      return {
        ...state,
        loadingUpdate: true,
      };
    },
    userUpdateSuccess(state) {
      return {
        ...state,
        loadingUpdate: false,
      };
    },
    userUpdateFail(state) {
      return {
        ...state,
        loadingUpdate: false,
      };
    },
    fetchUsers(state) {
      return {
        ...state,
        loading: true,
        error: ''
      }
    },
    fetchUsersSuccess(state, { payload }) {
      return {
        ...state,
        loading: false,
        users: payload
      }
    },
    fetchUsersFail(state, { payload }) {
      return {
        ...state,
        loading: false,
        error: payload
      }
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
  userUpdateFail,
  userUpdateSuccess,
  userUpdateResquest,
  saveShippingAddress,
  fetchUsers,
  fetchUsersSuccess,
  fetchUsersFail
} = userSlice.actions;
export const selectUser = (state) => state.userStore;
export default userSlice.reducer;
