export const addCartItem = (data) => {
  return {
    type: 'CART_ADD_ITEM',
    payload: data,
  };
};
