import React, { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';

import {
  fetchFailureProduct,
  fetchRequestProduct,
  fetchSuccessProduct,
  reviewFail,
  reviewRequest,
  reviewSuccess,
  selectProduct,
} from '../slice/productSlice';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { formatedDate, getError } from '../utils';
import { addCartItem, selectCart } from '../slice/cartSlice';
import HelmetSEO from '../components/HelmetSEO';
import { Cart3 } from 'react-bootstrap-icons';
import { selectUser } from '../slice/userSlice';

function ProductScreen() {

  let reviewRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const dispatch = useDispatch();

  const { product, loading, error, loadingCreateReview } = useSelector(selectProduct);
  const { userInfo } = useSelector(selectUser);
  const { cart } = useSelector(selectCart);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchRequestProduct());
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch(fetchSuccessProduct(result.data));
      } catch (err) {
        dispatch(fetchFailureProduct(getError(err)));
      }
    };
    fetchData();
  }, [dispatch, slug]);

  const addToCartHandler = async () => {
    const existItem = cart.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product.id}`);
    if (data.countInStock < quantity) {
      window.alert('Desculpe. Quantidade insuficiente no estoque');
      return;
    }
    dispatch(addCartItem({ ...product, quantity }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Por favor, deixe uma avaliação e um comentário');
      return;
    }
    try {
      dispatch(reviewRequest())
      const { data } = await axios.post(`/api/products/${product.id}/reviews`,
        { rating, comment },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      )
      toast.success('Comentário enviado com sucesso');
      dispatch(reviewSuccess());      
      dispatch(fetchSuccessProduct(data.product));
      setComment('');
      setRating(0)
      window.scrollTo({
        behavior: 'smooth',
        top: reviewRef.current.offsetTop
      })
    } catch (error) {
      console.log(error)
      toast.error(getError(error))
      dispatch(reviewFail())
    }
  }

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
              <HelmetSEO
                title={product.name}
                description={product.description}
                img={product.image}
                type='product'
              />
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
                      <Button onClick={addToCartHandler} variant="primary">
                        <Cart3 />&nbsp;
                        Add ao carrinho
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div className='my-3'>
        <h2 ref={reviewRef}>Avaliações</h2>
        <div className='mb-3'>
          {product.reviews && product.reviews.length === 0 && (
            <MessageBox>Ainda não há avaliações</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews?.map((review) => (
            <ListGroup.Item key={review.id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" " />
              <p>{formatedDate(review.createdAt)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className='my-3'>
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Escrever minha avaliação</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Avaliação</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Selecionar...</option>
                  <option value="1">1 - Ruim</option>
                  <option value="2">2 - Regular</option>
                  <option value="3">3 - Bom</option>
                  <option value="4">4 - Muito bom</option>
                  <option value="5">5 - Excelente</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Comentário..."
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder='Deixe seu comentário aqui'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>
              <div className='mb-3'>
                <Button disabled={loadingCreateReview} type="submit">
                  Avaliar
                </Button>
                {loadingCreateReview && <LoadingBox />}
              </div>
            </form>
          ) : (
            <MessageBox>
              Por favor, faça <Link to={`/signin?redirect=/product/${product.slug}`}>login</Link> para avaliar
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
