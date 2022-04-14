const initialState = {
  products: [],
  loading: false,
  error: '',
};

export const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.paylod,
        loading: false,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.paylod,
      };
    default:
      return state;
  }
};
