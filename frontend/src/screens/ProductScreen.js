import React, { useEffect } from 'react';

import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  fetchFailure,
  fetchRequest,
  fetchSuccess,
} from '../actions/product.actions';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  const { product, loading, error } = useSelector(
    (state) => state.productStore
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchRequest());
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch(fetchSuccess(result.data));
      } catch (err) {
        dispatch(fetchFailure(getError(err)));
      }
    };
    fetchData();
  }, [dispatch, slug]);

  return loading ? (
    <div className="d-flex justify-content-center">
      <LoadingBox />
    </div>
  ) : error ? (
    <>
      <Helmet>
        <title>Sammy's Store</title>
      </Helmet>
      <MessageBox variant="danger">{error}</MessageBox>
    </>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img src={product.image} className="img-large" alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variante="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>
              Descrição:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Preço:</Col>
                    <Col>R$ {product.price},00</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">Em estoque</Badge>
                      ) : (
                        <Badge bg="danger">Sem estoque</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button variant="primary">Add ao carrinho</Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProductScreen;
