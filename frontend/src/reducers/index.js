const productsStore = {
  products: [],
  loading: false,
  error: '',
};
const productStore = {
  product: {},
  loading: false,
  error: '',
};

const cartState = {
  cart: {
    cartItems: [],
  },
};

export const productsReducer = (state = productsStore, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST_PRODUCTS':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS_PRODUCTS':
      return {
        ...state,
        products: action.paylod,
        loading: false,
      };
    case 'FETCH_FAILURE_PRODUCTS':
      return {
        ...state,
        loading: false,
        error: action.paylod,
      };
    default:
      return state;
  }
};

export const cartReducer = (state = cartState, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      //add to cart
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, action.payload],
        },
      };
    default:
      return state;
  }
};

export const productReducer = (state = productStore, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        product: action.paylod,
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
