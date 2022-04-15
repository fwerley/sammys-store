import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { productReducer, productsReducer } from '../reducers';

const rootReducer = combineReducers({
  productsStore: productsReducer,
  productStore: productReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
