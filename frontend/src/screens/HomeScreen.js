import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  fetchFailure,
  fetchRequest,
  fetchSuccess,
} from '../actions/products.actions';

function HomeScreen() {
  const { products, loading, error } = useSelector(
    (state) => state.productsStore
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchRequest());
      try {
        const result = await axios.get('/api/products');
        dispatch(fetchSuccess(result.data));
      } catch (err) {
        dispatch(fetchFailure(err.message));
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Produtos em destaque</h1>
      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => (
            <div className="product" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.image} />
              </Link>
              <div className="product-info">
                <Link to={`/product/${product.slug}`}>
                  <p>{product.name}</p>
                </Link>
                <p>
                  <strong>{product.price}</strong>
                </p>
                <button>Adicionar ao carrinho</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
