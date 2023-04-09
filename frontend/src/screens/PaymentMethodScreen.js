import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';

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
        <h1 className="my-4">Forma de pagamento</h1>
        <Form onSubmit={submitHandler}>
          <Tab.Container id="left-tabs-payments" defaultActiveKey={paymentMethodName}>
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column fw-bold payments-link mb-1" onSelect={(event) => setPaymentMethod(event)}>
                  <Nav.Item>
                    <Nav.Link eventKey="CREDIT_CARD">
                      {/* <Form.Check
                        type="radio"
                        id="Cartao"
                        label="Cartão"
                        value="CREDIT_CARD"
                        checked={paymentMethodName === 'CREDIT_CARD'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      /> */}
                      Cartão
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="BILLET">
                      Boleto
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="PIX">
                      PIX
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content className='border p-2 rounded'>
                  <Tab.Pane eventKey="CREDIT_CARD">
                    - Parcele em até 12 vezes no cartão de crédito.<br/>
                    - Compre diretamente no débito.<br/>
                    - Compras 100% seguras
                  </Tab.Pane>
                  <Tab.Pane eventKey="BILLET">
                    - Gere uma fatura para pagamento<br/>
                    - Até três dias para pagar
                  </Tab.Pane>
                  <Tab.Pane eventKey="PIX">
                    - Gere um código de pagamento.<br/>
                    - Processamento imediato da compra.<br/>
                    - Sem burocracias
                  </Tab.Pane>
                </Tab.Content>
              </Col>
              <div className='payments-icons d-flex justify-content-center align-items-center flex-column my-2'>
                <div>
                  <i className="fas fa-lock"></i>&nbsp;&nbsp;Compra protegida
                </div>
                <div className='d-flex justify-content-between'>
                  <i className="fa-brands fa-pix" style={{ color: '#4BB8A9' }}></i>&nbsp;&nbsp;
                  <i className="fab fa-cc-mastercard" style={{ color: '#ff5f00' }}></i>&nbsp;&nbsp;
                  <i className="fab fa-cc-visa" style={{ color: '#1a1f71' }}></i>&nbsp;&nbsp;
                  <i className="fas fa-barcode"></i>
                </div>
              </div>
            </Row>
          </Tab.Container>
          <div className="my-3 text-end">
            <Button type="submit">
              <ArrowRight />&nbsp;
              Continuar
            </Button>
          </div>
        </Form>
      </div>
    </div >
  );
}
