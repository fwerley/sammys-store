import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  createFail,
  fetchSuccess,
  selectOrder,
} from '../slice/orderSlice';
import { selectUser } from '../slice/userSlice';
import { getError } from '../utils';

export default function OrderScreen() {
  const { error, order } = useSelector(selectOrder);
  const { userInfo } = useSelector(selectUser);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const [findOrder, setFindOrder] = useState(true);

  const { id: orderId } = params;

  const paymentTranslate = {CREDIT_CARD : "Cartão", BILLET : "Boleto"}
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {        
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch(fetchSuccess(data));
        setFindOrder(false)
      } catch (error) {
        dispatch(createFail(getError(error)));
        setFindOrder(false)
      }
    };

    if (!userInfo) {
      return navigate('/signin');
    }
    if (!order.id || (order.id && order.id !== orderId)) {      
      fetchOrder();
    }
  }, [order, userInfo, orderId, navigate, dispatch]);

  return findOrder ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <div className="container small-container">
      <MessageBox variant="danger">
        {error}. <Link to='/'>Retornar ao início</Link>
        </MessageBox>
    </div>
  ) : (
    <div>
      <Helmet>
        <title>Pedido - {orderId}</title>
      </Helmet>
      <h1 className="my-3">Pedido - {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dados de envio</Card.Title>
              <Card.Text>
                <strong>Nome: </strong> {order.shippingAddress.fullName}
                <br />
                <strong>Endereço: </strong>
                {order.shippingAddress.address},{' '}
                {order.shippingAddress.number}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="succes">
                  Enviado no dia {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Não enviado</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pagamento</Card.Title>
              <Card.Text>
                <strong>Método: </strong> {paymentTranslate[order.paymentMethod]}
                <br />
              </Card.Text>    
              {order.isPaid ? (
                <MessageBox variant="succes">
                  Pago no dia {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Pagamento pendente</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Itens</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item.product.id}>
                    <Row className="align-item-center">
                      <Col md={6}>
                        <img
                          src={item.product.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}                       
                        <Link to={`/product/${item.product.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>R$ {item.product.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Resumo do pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Itens</Col>
                    <Col>R$ {order.orderPrice.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Envio</Col>
                    <Col>R$ {order.orderPrice.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Taxa</Col>
                    <Col>R$ {order.orderPrice.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col><strong>R$ {order.orderPrice.totalPrice.toFixed(2)}</strong></Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
