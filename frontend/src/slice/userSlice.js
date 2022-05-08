import { createSlice } from '@reduxjs/toolkit';

const user = localStorage.getItem('userInfo');

const userStore = {
  userInfo: user ? JSON.parse(user) : null,
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
      return {
        ...state,
        userInfo: null,
      };
    },
  },
});

export const { userResquest, userSignin, userFailure, userSignout } =
  userSlice.actions;
export const selectUser = (state) => state.userStore;
export default userSlice.reducer;
