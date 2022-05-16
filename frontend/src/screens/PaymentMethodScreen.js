import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Cards from 'react-credit-cards';

import CheckoutSteps from '../components/CheckoutSteps';
import { selectUser } from '../slice/userSlice';
import { selectCart } from '../slice/cartSlice';
import { cartPaymentMethod, cartPaymentData } from '../slice/cartSlice';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector(selectUser);
  const { paymentMethod, paymentData } = useSelector(selectCart);

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod);
  const [cvc, setCvc] = useState(paymentData?.cvc || '');
  const [expiry, setExpiry] = useState(paymentData?.expiry || '');
  const [focus, setFocus] = useState('');
  const [name, setName] = useState(paymentData?.name || '');
  const [number, setNumber] = useState(paymentData?.number || '');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const handleInputFocus = (e) => {
    setFocus(e.target.name);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(cartPaymentMethod(paymentMethodName));
    if (paymentMethodName === 'Cartao') {
      dispatch(cartPaymentData({
        name,
        number,
        expiry,
        cvc
      }))
    }
    navigate('/placeorder');
  };

  return (
    <div>
      <Helmet>
        <title>Forma de pagamento</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Forma de pagamento</h1>
        <Form onSubmit={submitHandler}>
          <Tab.Container id="left-tabs-example" defaultActiveKey={paymentMethodName === 'Cartao'? 'first': 'second'}>
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="first">
                      <Form.Check
                        type="radio"
                        id="Cartao"
                        label="Cartao"
                        value="Cartao"
                        checked={paymentMethodName === 'Cartao'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">
                      <Form.Check
                        type="radio"
                        id="Boleto"
                        label="Boleto"
                        value="Boleto"
                        checked={paymentMethodName === 'Boleto'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content className="ms-3">
                  <Tab.Pane eventKey="first">
                    <div className="mb-3">
                      <Card>
                        <Card.Body>
                          <Card.Title>Dados do cartão de crédito</Card.Title>
                          <ListGroup variant="flush">
                            <ListGroup.Item>
                              <div id="PaymentForm">
                                <Cards
                                  cvc={cvc}
                                  expiry={expiry}
                                  focused={focus}
                                  name={name}
                                  number={number}
                                />
                              </div>
                            </ListGroup.Item>
                            {paymentMethodName === 'Cartao' ? (
                              <ListGroup.Item>
                                <Row>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="cardNumber"
                                  >
                                    <Form.Label>Número do cartão</Form.Label>
                                    <Form.Control
                                      type="number"
                                      name="number"
                                      value={number}
                                      onFocus={handleInputFocus}
                                      required
                                      onChange={(e) =>
                                        setNumber(e.target.value)
                                      }
                                    />
                                  </Form.Group>
                                </Row>
                                <Row>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="cardNameUser"
                                  >
                                    <Form.Label>Nome impresso</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name"
                                      value={name}
                                      placeholder="Ex. F NASCIMENTO"
                                      onFocus={handleInputFocus}
                                      required
                                      onChange={(e) => setName(e.target.value)}
                                    />
                                  </Form.Group>
                                </Row>
                                <Row>
                                  <Col sm={7}>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="cardExpiry"
                                    >
                                      <Form.Label>Validade</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="expiry"
                                        value={expiry}
                                        placeholder="MM/AA"
                                        onFocus={handleInputFocus}
                                        required
                                        onChange={(e) =>
                                          setExpiry(e.target.value)
                                        }
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col sm={5}>
                                    <Form.Group
                                      className="mb-3"
                                      controlId="cardCvc"
                                    >
                                      <Form.Label>CVC</Form.Label>
                                      <Form.Control
                                        type="text"
                                        name="cvc"
                                        value={cvc}
                                        placeholder="CVV/CVC"
                                        onFocus={handleInputFocus}
                                        required
                                        onChange={(e) => setCvc(e.target.value)}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </ListGroup.Item>
                            ) : (
                              //FIXME: Tira a renderização do cartão para evitar as chamadas aos campos de texto
                              ''
                            )}
                          </ListGroup>
                        </Card.Body>
                      </Card>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <div className="mb-3">World</div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
          <div className="my-3">
            <Button type="submit">Continuar</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
