export const userResquest = () => {
  return {
    type: 'USER_REQUEST',
  };
};

export const userSignin = (data) => {
  return {
    type: 'USER_SIGNIN',
    payload: data,
  };
};

export const userFailure = (error) => {
  return {
    type: 'USER_FAILURE',
    payload: error,
  };
};

export const userSignout = () => {
  return {
    type: 'USER_SIGNOUT',
  };
};
