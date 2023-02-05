import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Wallet2 } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
  createFail,
  fetchSuccess,
  selectOrder,
} from '../slice/orderSlice';
import { selectUser } from '../slice/userSlice';
import { formatedDate, getError } from '../utils';
import { paymentReset, selectPayment } from '../slice/paymentSlice';
import ModalBox from '../components/ModalBox';

export default function OrderScreen() {
  const { error, order } = useSelector(selectOrder);
  const { userInfo } = useSelector(selectUser);
  const { successPay } = useSelector(selectPayment)
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const [findOrder, setFindOrder] = useState(true);
  const [transaction, setTransaction] = useState({});

  const [modalShow, setModalShow] = useState(false);


  const { id: orderId } = params;

  const paymentTranslate = { CREDIT_CARD: "Cartão", BILLET: "Boleto" }

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

  const fetchTransactionData = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}/transaction`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      setTransaction(data)
    } catch (error) {
      console.info("Order without transaction: ", error)
    }
  };
  useEffect(() => {

    if (!userInfo) {
      return navigate('/signin');
    }
    if (!order.id || (order.id && order.id !== orderId)) {
      fetchOrder();
      fetchTransactionData();
    }

  }, [order, userInfo, orderId, navigate, dispatch]);


  useEffect(() => {
    let interval;
    if (successPay) {
      setTimeout(function () {
        if (modalShow) {
          setModalShow(false)
        }
      }, 4000)
      interval = setInterval(() => {
        if (Object.keys(transaction).length !== 0 && (transaction.status === 'APPROVED' || transaction.status === 'ERROR')) {
          dispatch(paymentReset())
          fetchOrder()
        }
        fetchTransactionData();
      }, 4000)
    }
    return () => clearInterval(interval);
  }, [successPay, transaction])

  const switchOrderMessage = (state) => {
    switch (state) {
      case 'APPROVED':
        return (
          <MessageBox variant="success">
            Pagamento aprovado {formatedDate(transaction.paidAt)}
          </MessageBox>
        )
        break;
      case 'PROCESSING':
        return (
          <MessageBox>
            <LoadingBox />&ensp;Aguardando a confirmação do banco ⌛
          </MessageBox>
        )
        break;
      case 'PENDING':
        return (
          <MessageBox>
            Pagamento com pendência de confirmação.
          </MessageBox>
        )
        break;
      case 'REFUNDED':
        return (
          <MessageBox>
            O pagamento foi extornado.
          </MessageBox>
        )
        break;
      case 'REFUSED':
        return (
          <MessageBox>
            O pagamento foi recusado pelo operador do cartão.
          </MessageBox>
        )
        break;
      case 'CHARGBACK':
        return (
          <MessageBox>
            O cancelamento da compra foi solicitado.
          </MessageBox>
        )
        break;
      case 'ERROR':
        return (
          <MessageBox variant='danger'>
            Sua tentativa de pagamento não foi concluída ❌ <br />
            Tente novamente!
          </MessageBox>
        )
        break;
      default:
        return (
          <MessageBox>
            Não conseguimos buscar as informações :(
          </MessageBox>
        )
    }
  }

  return findOrder ? (
    <div className="container small-container">
      <LoadingBox></LoadingBox>
    </div>
  ) : error ? (
    <div className="container small-container">
      <MessageBox variant="danger">
        {error}. <Link to='/'>Retornar ao início</Link>
      </MessageBox>
    </div>
  ) : (
    <div>
      <ModalBox
        show={modalShow}
        title='Pagamento'
        type={order.paymentMethod}
        onHide={() => setModalShow(false)}
      />
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
                {order.shippingAddress.address}{', '}
                {order.shippingAddress.number}{' - '}
                {order.shippingAddress.neighborhood}{', '}
                {order.shippingAddress.city}{' - '}
                {order.shippingAddress.federativeUnity}{', '}
                {order.shippingAddress.postalCode}
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
              {
                successPay ? (
                  <MessageBox>
                    <LoadingBox />&ensp;Aguardando a confirmação do banco ⌛
                  </MessageBox>
                ) : Object.keys(transaction).length !== 0 ?
                  switchOrderMessage(transaction.status)
                  :
                  <MessageBox variant="danger">Pagamento pendente</MessageBox>
              }
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
                {
                  !order.isPaid ?
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button type="button" className='d-flex flex-row justify-content-center' onClick={() => setModalShow(true)}>
                          <div className='me-2'>
                            <Wallet2
                              className=""
                              color='white'
                              size={20}
                            />
                          </div>
                          Vamos ao pagamento
                        </Button>
                      </div>
                    </ListGroup.Item>
                    : ''
                }
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
