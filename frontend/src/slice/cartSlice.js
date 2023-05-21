import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const itsCarts = localStorage.getItem('cart');
const pymtMethod = localStorage.getItem('paymentMethod');
const sellerSetting = localStorage.getItem('seller');

const cartStore = {
  cart: itsCarts ? JSON.parse(itsCarts) : [],
  seller: sellerSetting ? JSON.parse(sellerSetting) : {},
  itemsPrice: null,
  shippingPrice: null,
  totalPrice: null,
  paymentMethod: pymtMethod ? JSON.parse(pymtMethod) : 'CREDIT_CARD',
  paymentData: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: cartStore,
  reducers: {
    addCartItem(state, { payload }) {
      //add to cart
      const newItem = payload;
      const verifySeller = state.cart.length > 0 && state.seller === newItem.seller.id;
      // Veirfica se a loja é a mesma para os itens que já estão no carrinho
      if (!verifySeller && state.cart.length > 0) {
        toast.info('Este item é de outra loja. Conclua seu carrinho e faça uma nova compra 😀')
        return {
          ...state
        }
      }

      const existItem = state.cart.find((item) => item.id === newItem.id);
      const cartItems = existItem
        ? state.cart.map((item) => (item.id === existItem.id ? newItem : item))
        : [...state.cart, newItem];
      localStorage.setItem('cart', JSON.stringify(cartItems));
      toast.success('Item adicionado ao carrinho')
      return {
        ...state,
        cart: cartItems,
      };
    },
    cartRemoveItem(state, { payload }) {
      const cartItems = state.cart.filter((item) => item.id !== payload.id);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      if (cartItems.length === 0) {
        localStorage.removeItem('seller');
        return {
          ...state,
          cart: [],
          paymentMethod: '',
          seller: ''
        };
      }
      return {
        ...state,
        cart: cartItems,
      };
    },
    addSeller(state, { payload }) {
      localStorage.setItem('seller', JSON.stringify(payload));
      return {
        ...state,
        seller: payload
      }
    },
    cartPaymentMethod(state, { payload }) {
      localStorage.setItem('paymentMethod', JSON.stringify(payload));
      return {
        ...state,
        paymentMethod: payload,
      };
    },
    cartPaymentData(state, { payload }) {
      return {
        ...state,
        paymentData: payload,
      };
    },
    cartDelete(state) {
      localStorage.removeItem('cart');
      localStorage.removeItem('seller');
      localStorage.removeItem('paymentMethod');
      return {
        ...state,
        cart: [],
        paymentMethod: '',
        seller: ''
      };
    }
  },
});

export const { addCartItem, cartRemoveItem, addSeller, cartPaymentMethod, cartPaymentData, cartDelete } =
  cartSlice.actions;
export const selectCart = (state) => state.cartStore;
export default cartSlice.reducer;
