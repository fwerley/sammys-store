import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../components/CheckoutSteps';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoadingBox from '../components/LoadingBox';

import { cartDelete, selectCart } from '../slice/cartSlice';
import { selectUser } from '../slice/userSlice';
import {
  createRequest,
  createFail,
  createOrderSuccess,
  selectOrder,
} from '../slice/orderSlice';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Axios from 'axios';

export default function PlaceOrderScreen() {
  const shippingData = {
    selected: '',
    values: {
      sedex: 0,
      pac: 0,
    },
    time: {
      sedex: 0,
      pac: 0,
    },
    data: '',
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartStore = useSelector(selectCart);
  const { loading } = useSelector(selectOrder);
  const { shippingAddress, userInfo } = useSelector(selectUser);
  const [shippingMethod, setShippingMethod] = useState(shippingData);
  const { paymentMethod, cart } = cartStore;


  const paymentTranslate = {CREDIT_CARD : "Cartão", BILLET : "Boleto"}

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(cart.reduce((a, c) => a + c.quantity * c.price, 0));

  const shippingPriceCalc = (correiosPrice) =>
    itemsPrice > 250 ? round2(0) : round2(correiosPrice);
  // const taxPrice = round2(0.15 * itemsPrice);
  const taxPrice = 0;
  const valueSelected =
    shippingMethod.selected !== ''
      ? shippingMethod.selected === 'sedex'
        ? shippingMethod.values.sedex
        : shippingMethod.values.pac
      : 0.0;
  const totalPrice = itemsPrice + valueSelected + taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch(createRequest());
      // TODO: Verificar seção p/ enviar dados internamente pelo node

      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart,
          shippingAddress,
          paymentMethod,
          orderPrice: {
            itemsPrice,
            shippingPrice: valueSelected,
            taxPrice,
            totalPrice,
          },
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch(cartDelete());
      dispatch(createOrderSuccess());
      navigate(`/order/${data.order.id}`);
    } catch (err) {
      dispatch(createFail(err.message));
      toast.error(getError(err));
      console.log(err);
    }
  };

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
    const requestShipping = async () => {
      try {
        const result = await Axios.post('/api/correios/precoprazo', {
          sCepOrigem: '60870250',
          sCepDestino: shippingAddress.postalCode,
          nVlPeso: '1',
          nCdFormato: '1',
          nVlComprimento: '18',
          nVlAltura: '9',
          nVlLargura: '14',
          nCdServico: ['04014', '04510', '04227', '41106'],
          nVlDiametro: '0',
        });
        setShippingMethod({
          ...shippingMethod,
          values: {
            sedex: parseFloat(result.data[0].Valor.replace(',', '.')),
            pac: parseFloat(result.data[1].Valor.replace(',', '.')),
          },
          time: {
            sedex: result.data[0].PrazoEntrega,
            pac: result.data[1].PrazoEntrega,
          },
          data: result.data,
        });        
      } catch (err) {
        console.log(err);
      }
    };
    requestShipping();
  }, [navigate]);

  return (
    <div>
      <Helmet>
        <title>Ordem de compra</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <h1 className="my-3">Ordem de compra</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Dados de entrega</Card.Title>
              <Card.Text>
                <strong>Destinatário: </strong> {shippingAddress.fullName} <br />
                <strong>Endereço: </strong> {shippingAddress.address},{' '}
                {shippingAddress.number}, {shippingAddress.city}, {' '}
                {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </Card.Text>
              <Link to="/shipping">Editar</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Pagamento</Card.Title>
              <Card.Text>
                <strong>Método: </strong> {paymentTranslate[paymentMethod]} <br />
              </Card.Text>
              <Link to="/payment">Editar</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Itens</Card.Title>
              <ListGroup variant="flush">
                {cart.map((item) => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>R$ {item.price},00</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Editar</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Resumo do pedido</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Itens</Col>
                    <Col>R$ {itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Entrega</strong>
                  <ListGroup variant="flush">
                    {shippingMethod.data === '' ? (
                      <LoadingBox />
                    ) : (
                      <Form>
                        <ListGroup.Item>
                          <Row>
                            <Col>
                              <Form.Check
                                type="radio"
                                id="sedex"
                                value="sedex"
                                checked={shippingMethod.selected === 'sedex'}
                                onChange={(e) =>
                                  setShippingMethod({
                                    ...shippingMethod,
                                    selected: e.target.value,
                                  })
                                }
                                label="SEDEX"
                              />
                            </Col>
                            <Col>
                              {shippingMethod.time.sedex} dia
                              {shippingMethod.time.sedex > 1 ? 's' : ''}
                            </Col>
                            <Col>
                              R$ {shippingMethod.values.sedex.toFixed(2)}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col>
                              <Form.Check
                                type="radio"
                                id="pac"
                                value="pac"
                                checked={shippingMethod.selected === 'pac'}
                                onChange={(e) =>
                                  setShippingMethod({
                                    ...shippingMethod,
                                    selected: e.target.value,
                                  })
                                }
                                label="PAC"
                              />
                            </Col>
                            <Col>
                              {shippingMethod.time.pac} dia
                              {shippingMethod.time.pac > 1 ? 's' : ''}
                            </Col>
                            <Col>R$ {shippingMethod.values.pac.toFixed(2)}</Col>
                          </Row>
                        </ListGroup.Item>
                      </Form>
                    )}
                  </ListGroup>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Taxas</Col>
                    <Col>R$ {taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      <strong>R$ {totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={placeOrderHandler}
                      disabled={cart.length === 0 || shippingMethod.selected === ''}
                    >
                      {loading ? <LoadingBox></LoadingBox> : 'Finalizar pedido'}
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
