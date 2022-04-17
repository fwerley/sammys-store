export const addCartItem = (data) => {
  return {
    type: 'CART_ADD_ITEM',
    payload: data,
  };
};

export const cartRemoveItem = (data) => {
  return {
    type: 'CART_REMOVE_ITEM',
    payload: data,
  };
};
