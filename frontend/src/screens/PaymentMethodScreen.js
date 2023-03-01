import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import CheckoutSteps from '../components/CheckoutSteps';
import { selectUser } from '../slice/userSlice';
import { selectCart } from '../slice/cartSlice';
import { cartPaymentMethod, cartPaymentData } from '../slice/cartSlice';
import HelmetSEO from '../components/HelmetSEO';
import { ArrowRight } from 'react-bootstrap-icons';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector(selectUser);
  const { paymentMethod, paymentData } = useSelector(selectCart);

  const [paymentMethodName, setPaymentMethod] = useState(paymentMethod);
  const [cvc, setCvc] = useState(paymentData?.cvc || '');
  const [expiry, setExpiry] = useState(paymentData?.expiry || '');
  const [name, setName] = useState(paymentData?.name || '');
  const [number, setNumber] = useState(paymentData?.number || '');

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(cartPaymentMethod(paymentMethodName));
    if (paymentMethodName === 'CREDIT_CARD') {
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
      <HelmetSEO
        title='Forma de pagamento'
        description="Escolha sua forma de pagamento"
        type='store'
      />
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Forma de pagamento</h1>
        <Form onSubmit={submitHandler}>
          <Tab.Container id="left-tabs-example" defaultActiveKey={paymentMethodName === 'Cartao' ? 'first' : 'second'}>
            <Row>
              <Col sm={3}>
                {/* <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="first"> */}
                <Form.Check
                  type="radio"
                  id="Cartao"
                  label="Cartão"
                  value="CREDIT_CARD"
                  checked={paymentMethodName === 'CREDIT_CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                {/* </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second"> */}
                <Form.Check
                  type="radio"
                  id="Boleto"
                  label="Boleto"
                  value="BILLET"
                  checked={paymentMethodName === 'BILLET'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  id="PIX"
                  label="PIX"
                  value="PIX"
                  checked={paymentMethodName === 'PIX'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
              </Col>
            </Row>
          </Tab.Container>
          <div className="my-3">
            <Button type="submit">
              <ArrowRight />&nbsp;
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
