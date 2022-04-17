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
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
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
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }
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
