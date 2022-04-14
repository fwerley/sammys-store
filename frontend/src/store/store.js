import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { productsReducer } from '../reducers';

const rootReducer = combineReducers({
  productsStore: productsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
