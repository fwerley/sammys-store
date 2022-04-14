export const fetchRequest = () => {
  return {
    type: 'FETCH_REQUEST',
  };
};

export const fetchSuccess = (data) => {
  return {
    type: 'FETCH_SUCCESS',
    paylod: data,
  };
};

export const fetchFailure = (error) => {
  return {
    type: 'FETCH_FAILURE',
    paylod: error,
  };
};
