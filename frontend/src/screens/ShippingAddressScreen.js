import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useDispatch, useSelector } from 'react-redux';

import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { selectUser, saveShippingAddress } from '../slice/userSlice';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector(selectUser);

  const { shippingAddress } = useSelector(selectUser);

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [number, setNumber] = useState(shippingAddress.number || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [federativeUnity, setCountry] = useState(shippingAddress.federativeUnity || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        fullName,
        number,
        address,
        city,
        postalCode,
        federativeUnity,
      })
    );
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Endereço de envio</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className="container small-container">
        <h1 className="my-3">Endereço de envio</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Nome completo</Form.Label>
            <Form.Control
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Row>
            <Col sm={9}>
            <Form.Group className="mb-3" controlId="address">
            <Form.Label>Endereço</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />            
          </Form.Group>
            </Col>
            <Col sm={3}>
          <Form.Group className="mb-3" controlId="address">
          <Form.Label>Numero</Form.Label>
            <Form.Control
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>CEP</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              value={federativeUnity}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button variant="primary" type="submit">
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
