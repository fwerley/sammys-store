import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
  deliverFail,
  deliverRequest,
  deliverReset,
  deliverSuccess,
  fetchFail,
  fetchSuccess,
  selectOrder,
} from '../slice/orderSlice';
import { selectUser } from '../slice/userSlice';
import { formatCoin, formatedDate, getError } from '../utils';
import { paymentReset, selectPayment } from '../slice/paymentSlice';
import ModalBox from '../components/ModalBox';
import HelmetSEO from '../components/HelmetSEO';
import { toast } from 'react-toastify';
import { fetchTransaction, fetchTransactionFail, selectTransaction, successTransaction } from '../slice/transactionSlice';
import SuccessCircleAnimate from '../components/SuccessCircleAnimate';
import TrackOrder from '../components/TrackOrder';

export default function OrderScreen() {
  const { error, order, orderLoading, loadingDeliver, successDeliver } = useSelector(selectOrder);
  const { userInfo } = useSelector(selectUser);
  const { successPay } = useSelector(selectPayment);
  const { transaction, loading: loadingTransaction } = useSelector(selectTransaction);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false);
  const [modalDelivery, setModalDelivery] = useState(false);
  const [copyBillet, setCopyBillet] = useState(false);

  const { id: orderId } = params;

  const paymentTranslate = { CREDIT_CARD: "Cartão", BILLET: "Boleto", PIX: "PIX" }

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch(fetchSuccess(data));
    } catch (error) {
      dispatch(fetchFail(getError(error)));
    }
  };

  const fetchTransactionData = async () => {
    try {
      dispatch(fetchTransaction());
      const { data } = await axios.get(`/api/orders/${orderId}/transaction`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch(successTransaction(data));
    } catch (error) {
      dispatch(fetchTransactionFail(getError(error)));
    }
  };

  const deliveredOrderHandler = async () => {
    try {
      dispatch(deliverRequest())
      await axios.put(`/api/orders/${order.id}/delivered`, {}, {
        headers: { authorization: `Bearer ${userInfo.token}` }
      })
      dispatch(deliverSuccess());
      toast.success('Pedido enviado');
    } catch (error) {
      dispatch(deliverFail(getError(error)));
      toast.error(getError(error));
    }
  }

  const deliverOrderHandler = () => {
    setModalDelivery(true)
  }

  // function toDataURL(url, callback) {
  //   var xhr = new XMLHttpRequest();
  //   xhr.onload = function() {
  //     var reader = new FileReader();
  //     reader.onloadend = function() {
  //       callback(reader.result);
  //     }
  //     reader.readAsDataURL(xhr.response);
  //   };
  //   xhr.open('GET', url);
  //   xhr.responseType = 'blob';
  //   xhr.send();
  // }

  // toDataURL('https://api.pagar.me/core/v5/transactions/tran_oWpDmkWSdSlwPl7X/qrcode?payment_method=pix', function(dataUrl) {
  //   console.log('RESULT:', dataUrl)
  // })

  useEffect(() => {
    // setLoadData(true);
    if (!userInfo) {
      return navigate('/signin');
    }
    if (!order.id || (order.id && order.id !== orderId) || successDeliver) {
      setModalDelivery(false)
      fetchOrder();
      fetchTransactionData();
      dispatch(deliverReset())
    }
    // setLoadData(false);
  }, [order, userInfo, orderId, successDeliver, navigate, dispatch]);


  useEffect(() => {
    let interval;
    if (successPay) {
      setTimeout(function () {
        if (modalShow) {
          setModalShow(false)
        }
      }, 4000)

      interval = setInterval(() => {
        if (transaction && (transaction.status === 'APPROVED' || transaction.status === 'ERROR') || (
          order.paymentMethod === 'BILLET' || order.paymentMethod === 'PIX' && transaction.status === 'STARTED'
        )) {
          dispatch(paymentReset())
          fetchOrder()
        }
        fetchTransactionData();
      }, 4000)
    }
    return () => clearInterval(interval);
  }, [successPay, transaction, dispatch, modalShow])

  const switchOrderMessage = (state) => {
    const copyCordeBillet = () => {
      navigator.clipboard.writeText(transaction.barCode)
      setCopyBillet(true);
    }
    switch (state) {
      case 'STARTED':
        return (
          <MessageBox variant="info">
            <div className="boleto-container">
              <div
                className={`d-flex justify-content-between mb-2 align-items-center ${copyBillet ? 'border-success' : ''}`}
                onClick={copyCordeBillet}
              >
                {transaction.barCode}
                <span>
                  {!copyBillet ?
                    <i className="fa-solid fa-copy"></i>
                    : <SuccessCircleAnimate dimension={20} />
                  }
                </span>
              </div>
              <Link to={transaction.urlBillet} style={{ textDecoration: 'underline' }} target='_blank'>
                {transaction.urlBillet.includes('pix') ? 'Ver QR Code' : 'Imprimir boleto'}
              </Link>
            </div>
          </MessageBox>
        )
      case 'APPROVED':
        return (
          <MessageBox variant="success">
            Pagamento aprovado {formatedDate(transaction.paidAt)}
          </MessageBox>
        )
      case 'PROCESSING':
        return (
          <MessageBox>
            Seu pagamento está sendo processado ⌛
          </MessageBox>
        )
      case 'PENDING':
        return (
          <MessageBox>
            Pagamento com pendência de confirmação.
          </MessageBox>
        )
      case 'REFUNDED':
        return (
          <MessageBox>
            O pagamento foi extornado.
          </MessageBox>
        )
      case 'REFUSED':
        return (
          <MessageBox>
            O pagamento foi recusado pelo operador do cartão.
          </MessageBox>
        )
      case 'CHARGBACK':
        return (
          <MessageBox>
            O cancelamento da compra foi solicitado.
          </MessageBox>
        )
      case 'ERROR':
        return (
          <MessageBox variant='danger'>
            Sua tentativa de pagamento não foi concluída ❌ <br />
            Tente novamente!
          </MessageBox>
        )
      default:
        return (
          <MessageBox>
            Não conseguimos buscar as informações :(
          </MessageBox>
        )
    }
  }

  return orderLoading ? (
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
        show={modalDelivery}
        title='Dados de envio'
        type='delivery'
        onHide={() => setModalDelivery(false)}
      />
      <ModalBox
        show={modalShow}
        title='Pagamento'
        type={order.paymentMethod}
        onHide={() => setModalShow(false)}
      />
      <HelmetSEO
        title={'Pedido - ' + orderId}
        description="Pedido de compra"
        type='store'
      />
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
              {loadingDeliver ? (
                <LoadingBox />
              ) : order.deliveredAt ? (
                <MessageBox variant="success">
                  Pedido entregue dia {formatedDate(order.deliveredAt)}
                </MessageBox>
              ) : order.isDelivered ? (
                <MessageBox variant="info">
                  <strong>Pedido enviado</strong> - {order.deliveryOrder?.trackingCode}
                  {order.deliveryOrder?.shippingCompany === 'Correios' && (
                    <TrackOrder code={order.deliveryOrder?.trackingCode}/>
                  )}
                </MessageBox>
              ) : (
                <MessageBox variant="warning">Não enviado</MessageBox>
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
              {loadingTransaction ? (
                <LoadingBox />
              ) : successPay ? (
                <MessageBox>
                  Seu pagamento está sendo processado ⌛
                </MessageBox>
              ) : transaction.status ?
                switchOrderMessage(transaction.status)
                :
                <MessageBox variant="warning">Pagamento pendente</MessageBox>
              }
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Itens</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item.product.id}>
                    <Row className="d-flex align-items-center">
                      <Col md={9}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item.product.slug}`}>{item.product.name}</Link>
                      </Col>
                      <Col md={1}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={2}>{formatCoin(item.product.price)}</Col>
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
                    <Col>{formatCoin(order.orderPrice.itemsPrice.toFixed(2))}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Envio</Col>
                    <Col>{formatCoin(order.orderPrice.shippingPrice.toFixed(2))}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Taxa</Col>
                    <Col>{formatCoin(order.orderPrice.taxPrice.toFixed(2))}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col><strong>{formatCoin(order.orderPrice.totalPrice.toFixed(2))}</strong></Col>
                  </Row>
                </ListGroup.Item>
                {loadingTransaction ? ('') :
                  transaction && transaction.status !== 'APPROVED' && transaction.status !== 'PROCESSING' && order.user.id === userInfo.id && !transaction.barCode ?
                    (
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
                    ) : !order.isPaid && order.user.id === userInfo.id && !transaction.barCode ? (
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
                    ) : ('')}
                {userInfo.isAdmin && order.isPaid && !order.deliveryOrder && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox />}
                    <div className='d-grid'>
                      <Button type='button' onClick={deliverOrderHandler}>
                        <i className="fas fa-shipping-fast" />&nbsp;
                        Enviar pedido
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin && order.isPaid && !order.deliveredAt && order.deliveryOrder && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox />}
                    <div className='d-grid'>
                      <Button type='button' onClick={deliveredOrderHandler}>
                        <i className="fas fa-box" />&nbsp;
                        Pedido entregue
                      </Button>
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
