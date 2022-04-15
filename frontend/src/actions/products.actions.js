export const fetchRequest = () => {
  return {
    type: 'FETCH_REQUEST_PRODUCTS',
  };
};

export const fetchSuccess = (data) => {
  return {
    type: 'FETCH_SUCCESS_PRODUCTS',
    paylod: data,
  };
};

export const fetchFailure = (error) => {
  return {
    type: 'FETCH_FAILURE_PRODUCTS',
    paylod: error,
  };
};
