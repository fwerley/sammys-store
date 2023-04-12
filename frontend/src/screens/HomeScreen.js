import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
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
import { Link } from 'react-router-dom';

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
      <Carousel fade={false} indicators={false} controls>
        <Carousel.Item>
          <Link to=''>
            <img
              className="d-block w-100"
              src="images/banner.png"
              alt="First slide"
            />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="http://www.julietbennett.com/wp-content/uploads/2011/04/IMG_0232-800x300.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://i0.wp.com/seginfo.com.br/wp-content/uploads/2018/06/oil-rig-800x300.jpg?resize=800%2C300&ssl=1"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
      <div className='my-4'>
        <h1>Produtos em destaque</h1>
      </div>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} xs={6} className="mb-3">
                <Product product={product} seller />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
