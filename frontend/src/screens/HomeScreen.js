import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  fetchFailure,
  fetchRequest,
  fetchSuccess,
  selectProducts,
} from '../slice/productsSlice';
import Product from '../components/Product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import HelmetSEO from '../components/HelmetSEO';

function HomeScreen() {
  const { products, loading, error } = useSelector(selectProducts);
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
  }, [dispatch]);

  return (
    <div>
      <HelmetSEO
        title="Sammy's Store"  
        description='Produtos em destaque'
        type='store'
      />
      <h1>Produtos em destaque</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} xs={6} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
