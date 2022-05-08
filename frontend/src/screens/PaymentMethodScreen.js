import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CheckoutSteps from '../components/CheckoutSteps';
import { selectUser } from '../slice/userSlice';
import { selectCart } from '../slice/cartSlice';
import { cartPaymentMethod } from '../slice/cartSlice';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector(selectUser);
  const { paymentMethod } = useSelector(selectCart);
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PagueSeguro'
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(cartPaymentMethod( paymentMethodName ));
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
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="PagueSeguro"
              label="PagueSeguro"
              value="PagueSeguro"
              checked={paymentMethodName === 'PagueSeguro'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Boleto"
              label="Boleto"
              value="Boleto"
              checked={paymentMethodName === 'Boleto'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Button type="submit">Continuar</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
