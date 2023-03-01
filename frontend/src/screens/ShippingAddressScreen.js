import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputMask from 'react-input-mask';
import { PinMapFill, ArrowRight, GlobeAmericas } from 'react-bootstrap-icons';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import { useDispatch, useSelector } from 'react-redux';

import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { selectUser, saveShippingAddress, setFullBoxOff } from '../slice/userSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { Typeahead } from 'react-bootstrap-typeahead';
import { estados } from '../utils';
import { selectCart } from '../slice/cartSlice';

export default function ShippingAddressScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fullBox } = useSelector(selectCart);
  const { userInfo, shippingAddress } = useSelector(selectUser);

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

  useEffect(() => {
    setNumber(shippingAddress.number)
    setAddress(shippingAddress.address)
    setNeighborhood(shippingAddress.neighborhood)
    setCity(shippingAddress.city)
    setPostalCode(shippingAddress.postalCode)
    setCountry(shippingAddress.federativeUnity) 
  },[shippingAddress])

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
        location: shippingAddress.location
      })
    );
    navigate('/payment');
  };

  useEffect(() => {
    dispatch(setFullBoxOff())
  }, [fullBox, dispatch])

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
              </Form.Group>
            </Col>
          </Row>
          <div className="mb-3 d-flex justify-content-between">
            <Button
              variant="light"
              id="chooseOnMap"
              type="button"
              onClick={() => navigate('/map')}
            >
              <PinMapFill />&nbsp;
              Ver no mapa
            </Button>
            {shippingAddress.location && shippingAddress.location.lat ? (
              <div className='d-flex align-items-center justify-content-center btn-primary px-2 rounded'>
                <GlobeAmericas />&nbsp;
                {Number(shippingAddress.location.lat).toFixed(2)}&nbsp;
                {Number(shippingAddress.location.lng).toFixed(2)}
              </div>
            ) : (<div>Sem localização</div>)}
            <Button variant="primary" type="submit">
              <ArrowRight />&nbsp;
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
