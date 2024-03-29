import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { useSelector, useDispatch } from 'react-redux';
import { addCartItem, cartRemoveItem, selectCart } from '../slice/cartSlice';
import HelmetSEO from '../components/HelmetSEO';

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector(selectCart);

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item.id}`);
    if (data.countInStock < quantity) {
      window.alert('Desculpe. Quantidade insuficiente no estoque');
      return;
    }
    dispatch(addCartItem({ ...item, quantity }));
  };
  const removeItemHandler = (item) => {
    dispatch(cartRemoveItem(item));
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <HelmetSEO
        title='Carrinho de compras'
        description='Carrinho de compras'
        type='pay'
      />
      <h1>Carrinho de compras</h1>
      <Row>
        <Col md={8}>
          {cart.length === 0 ? (
            <MessageBox>
              Carrinho vazio. <Link to="/">Ir para o início</Link>
            </MessageBox>
          ) : (
            <ListGroup className='mb-1'>
              {cart.map((item) => (
                <ListGroup.Item key={item.id}>
                  <Row className="align-items-center">
                    <Col md={6} xs={12}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3} xs={5}>
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <i className="fas fa-minus-circle" />
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <i className="fas fa-plus-circle" />
                      </Button>
                    </Col>
                    <Col md={2} xs={4}>R$ {item.price},00</Col>
                    <Col md={1} xs={3}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                      >
                        <i className="fas fa-trash" />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cart.reduce((a, c) => a + c.quantity, 0)} itens)
                    : R$
                    {cart.reduce((a, c) => a + c.price * c.quantity, 0)},00
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cart.length === 0}
                    >
                      Proceder ao checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
