import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputMask from 'react-input-mask';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import { useDispatch, useSelector } from 'react-redux';

import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { selectUser, saveShippingAddress } from '../slice/userSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { Typeahead } from 'react-bootstrap-typeahead';
import { estados } from '../utils';

export default function ShippingAddressScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector(selectUser);

  const { shippingAddress } = useSelector(selectUser);

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [number, setNumber] = useState(shippingAddress.number || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [neighborhood, setNeighborhood] = useState(shippingAddress.neighborhood || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [federativeUnity, setCountry] = useState(shippingAddress.federativeUnity || []);

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
        neighborhood,
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
            <Col sm={6}>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3" controlId="neighborhood">
                <Form.Label>Bairro</Form.Label>
                <Form.Control
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={2}>
              <Form.Group className="mb-3" controlId="number">
                <Form.Label>Numero</Form.Label>
                <Form.Control
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <Form.Group className="mb-3" controlId="city">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3" controlId="postalCode">
                <Form.Label>CEP</Form.Label>
                <Form.Control
                  as={InputMask}
                  mask="99999-999"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col sm={4}>
              <Form.Group className="mb-3" controlId="country">
                <Form.Label>Estado</Form.Label>
                <Typeahead
                  id="basic-example"
                  onChange={setCountry}
                  options={estados}
                  placeholder="Selecione o estado"
                  selected={federativeUnity}
                />
                {/* <Form.Control
              value={federativeUnity}
              onChange={(e) => setCountry(e.target.value)}
              required
            /> */}
              </Form.Group>
            </Col>
          </Row>
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
