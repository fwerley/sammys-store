import { createSlice } from '@reduxjs/toolkit';

const user = localStorage.getItem('userInfo');
const shpAddress = localStorage.getItem('shippingAddress');

const userStore = {
  fullBox: false,
  users: [],
  userInfo: user ? JSON.parse(user) : null,
  shippingAddress: shpAddress ? JSON.parse(shpAddress) : {},
  loading: false,
  loadingUpdate: false,
  loadingDelete: false,
  successDelete: false,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: userStore,
  reducers: {
    resetUser(state) {
      return {
        ...state,
        loading: false
      }
    },
    uploadRequestLogo(state) {
      return {
        ...state,
        loadingUpdate: true
      }
    },
    uploadSuccessLogo(state) {
      return {
        ...state,
        loadingUpdate: false
      }
    },
    uploadFailLogo(state, {payload}) {
      return {
        ...state,
        loadingUpdate: false,
        error: payload
      }
    },
    userResquest(state) {
      return {
        ...state,
        loading: true,
        error: ''
      };
    },
    userResquestSuccess(state) {
      return {
        ...state,
        loading: false
      }
    },
    userSignin(state, { payload }) {
      return {
        ...state,
        userInfo: payload,
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
    userFailure(state, { payload }) {
      return {
        ...state,
        error: payload,
        loading: false,
      };
    },
    userUpdateRequest(state) {
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
    deleteUserRequest(state) {
      return {
        ...state,
        loadingDelete: true,
        successDelete: false
      }
    },
    deleteUserSuccess(state, { payload }) {
      return {
        ...state,
        loadingDelete: false,
        successDelete: true
      }
    },
    deleteUserFail(state, { payload }) {
      return {
        ...state,
        loadingDelete: false,
      }
    },
    deleteUserReset(state) {
      return {
        ...state,
        loadingDelete: false,
        successDelete: false
      }
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
    saveShippingAddress(state, { payload }) {
      localStorage.setItem('shippingAddress', JSON.stringify(payload));
      return {
        ...state,
        shippingAddress: payload,
      };
    },
    setFullBoxOn(state) {
      return {
        ...state,
        fullBox: true
      }
    },
    setFullBoxOff(state) {
      return {
        ...state,
        fullBox: false
      }
    },
  },
});

export const {
  resetUser,
  uploadRequestLogo,
  uploadSuccessLogo,
  uploadFailLogo,
  userResquest,
  userResquestSuccess,
  userSignin,
  userFailure,
  userSignout,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFail,
  deleteUserReset,
  userUpdateFail,
  userUpdateSuccess,
  userUpdateRequest,
  saveShippingAddress,
  fetchUsers,
  fetchUsersSuccess,
  fetchUsersFail,
  setFullBoxOn,
  setFullBoxOff
} = userSlice.actions;
export const selectUser = (state) => state.userStore;
export default userSlice.reducer;
