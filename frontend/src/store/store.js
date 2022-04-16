import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { cartReducer, productReducer, productsReducer } from '../reducers';

const rootReducer = combineReducers({
  productsStore: productsReducer,
  productStore: productReducer,
  cartStore: cartReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
