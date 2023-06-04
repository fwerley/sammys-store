import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Cards from 'react-credit-cards';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputMask from 'react-input-mask';
import { useEffect, useState } from 'react';
import { paymentFail, paymentRequest, paymentReset, paymentSuccess, selectPayment } from '../slice/paymentSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../slice/userSlice';
import { deleteRequest, deliverFail, deliverRequest, deliverSuccess, selectOrder } from '../slice/orderSlice';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import MessageBox from './MessageBox';
import LoadingBox from './LoadingBox';
import { toast } from 'react-toastify';
import { formatCoin, getError } from '../utils';


function ModalBox(props) {
    return (
        <Modal
            {...props}
            size={`${props.type === 'BILLET' || props.type === 'PIX' ? 'sm' : ''}`}
            // dialogClassName="modal-90w"
            aria-labelledby="container-modal-title-vcenter"
            centered
        // animation={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {ComponentChild(props.type)}
            </Modal.Body>
        </Modal>
    )
}

const ComponentChild = (typeRender) => {
    const [cvc, setCvc] = useState('');
    const [expiry, setExpiry] = useState('');
    const [focus, setFocus] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [shippingCompany, setShippingCompany] = useState('');
    const [trackingCode, setTrackingCode] = useState('');
    const [linkShipping, setLinkShipping] = useState('');
    const dispatch = useDispatch();
    const { order, loadingDeliver, successDeliver, errorDeliver } = useSelector(selectOrder);
    const { userInfo } = useSelector(selectUser);
    const { successPay, loadingPay, errorPay } = useSelector(selectPayment)

    const [cpf, setCPF] = useState('');

    const handleInputFocus = (e) => {
        setFocus(e.target.name);
    };

    const payOrder = async () => {
        try {
            if (!cpf) {
                toast.warning('O campo CPF é obrigatório');
                return;
            }

            dispatch(paymentRequest())
            await axios.post(
                `/api/orders/${order.id}/pay`,
                {
                    paymentType: order.paymentMethod,
                    installments: order.paymentMethod === 'CREDIT_CARD' ? order.orderPrice.installments : 1,
                    customerName: userInfo.name,
                    customerEmail: userInfo.email,
                    customerMobile: userInfo.mobile || '',
                    customerDocument: cpf,
                    billingAddress: order.shippingAddress.address,
                    billingNumber: order.shippingAddress.number,
                    billingNeighborhood: order.shippingAddress.neighborhood,
                    billingCity: order.shippingAddress.city,
                    billingState: order.shippingAddress.federativeUnity,
                    billingZipCode: order.shippingAddress.postalCode,
                    creditCardNumber: number,
                    creditCardExpiration: expiry,
                    creditCardHolderName: name,
                    creditCardCvv: cvc
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                }
            )
            dispatch(paymentSuccess());
        } catch (error) {
            dispatch(paymentFail(getError(error)));
            toast.error(getError(error));
            setTimeout(() => {
                dispatch(paymentReset())
            }, 3000)
            console.log(error);
        }
    }

    const deliverOrder = async () => {
        try {
            dispatch(deliverRequest())
            const { data } = await axios.post(
                `/api/orders/${order.id}/deliver`,
                {
                    shippingCompany,
                    linkShipping,
                    trackingCode
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                });
            dispatch(deliverSuccess(data))
        } catch (error) {
            dispatch(deliverFail(getError(error)))
            toast.error(getError(error));
            console.log(error);
        }
    }

    const CardPay = (
        <Card>
            <Card.Body>
                {/* <Card.Title>Dados do cartão de crédito</Card.Title> */}
                {
                    loadingPay ?
                        <LoadingBox></LoadingBox> :
                        successPay ?
                            <MessageBox variant="success">
                                Sua solicitação foi recebida e está em processamento! 😊
                            </MessageBox> :
                            errorPay !== '' ?
                                <MessageBox>
                                    Infelizmente não foi possivel concluir a transação ⚠️
                                    Tente novamente em alguns minutos!
                                </MessageBox> :
                                (
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
                                        <ListGroup.Item>
                                            <Row>
                                                <Col sm={7}>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="cardNumber"
                                                    >
                                                        <Form.Label>Número do cartão</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            as={InputMask}
                                                            mask="9999 9999 9999 9999"
                                                            placeholder='9999 9999 9999 9999'
                                                            name="number"
                                                            value={number}
                                                            onFocus={handleInputFocus}
                                                            required
                                                            onChange={(e) =>
                                                                setNumber(e.target.value)
                                                            }
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col sm={5}>
                                                    <Form.Group className="mb-3" controlId="installments">
                                                        <Form.Label>CPF do titular</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            as={InputMask}
                                                            mask="999.999.999-99"
                                                            name="cpf"
                                                            value={cpf}
                                                            placeholder="000.000.000-00"
                                                            required
                                                            onChange={(e) => setCPF(e.target.value)}
                                                        />
                                                        {/* <Typeahead
                                                            id="basic-example"
                                                            onChange={setInstallments}
                                                            options={arrayInstallments()}
                                                            placeholder="N° de parcelas"
                                                            selected={installments}
                                                        /> */}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={6}>
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
                                                </Col>
                                                <Col sm={3}>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="cardExpiry"
                                                    >
                                                        <Form.Label>Validade</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            as={InputMask}
                                                            mask="99/99"
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
                                                <Col sm={3}>
                                                    <Form.Group
                                                        className="mb-3"
                                                        controlId="cardCvc"
                                                    >
                                                        <Form.Label>CVV</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            as={InputMask}
                                                            mask="999"
                                                            name="cvc"
                                                            value={cvc}
                                                            placeholder="CVV"
                                                            onFocus={handleInputFocus}
                                                            required
                                                            onChange={(e) => setCvc(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={7}>
                                                </Col>
                                                <Col sm={5}>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <div className="d-grid">
                                                <Button type="button" className='d-flex flex-row justify-content-center' onClick={payOrder}>
                                                    Pagar
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    </ListGroup>
                                )
                }
            </Card.Body>
        </Card>
    )
    const BilletPay = (
        loadingPay ?
            <LoadingBox></LoadingBox> :
            successPay ?
                <MessageBox variant="success">
                    Solicitação recebida.
                    Verifique na seção pagamento o link para o seu boleto! 😊
                </MessageBox> :
                errorPay !== '' ?
                    <MessageBox>
                        Infelizmente não foi possivel concluir a transação ⚠️
                        Tente novamente em alguns minutos!
                    </MessageBox> :
                    <div>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="installments">
                                        <Form.Label>CPF do pagador</Form.Label>
                                        <Form.Control
                                            type="text"
                                            as={InputMask}
                                            mask="999.999.999-99"
                                            name="cpf"
                                            value={cpf}
                                            placeholder="000.000.000-00"
                                            required
                                            onChange={(e) => setCPF(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="d-grid">
                            <Button type="button" className='d-flex flex-row justify-content-center' onClick={payOrder}>
                                Gerar boleto
                            </Button>
                        </div>
                    </div>
    )
    const PixPay = (
        loadingPay ?
            <LoadingBox></LoadingBox> :
            successPay ?
                <MessageBox variant="success">
                    Solicitação recebida.
                    Verifique na seção pagamento o código, copie e tudo certo! 😊
                </MessageBox> :
                errorPay !== '' ?
                    <MessageBox>
                        Infelizmente não foi possivel concluir a transação ⚠️
                        Tente novamente em alguns minutos!
                    </MessageBox> :
                    <div>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="installments">
                                        <Form.Label>CPF do pagador</Form.Label>
                                        <Form.Control
                                            type="text"
                                            as={InputMask}
                                            mask="999.999.999-99"
                                            name="cpf"
                                            value={cpf}
                                            placeholder="000.000.000-00"
                                            required
                                            onChange={(e) => setCPF(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <div className="d-grid">
                            <Button type="button" className='d-flex flex-row justify-content-center' onClick={payOrder}>
                                Gerar código PIX
                            </Button>
                        </div>
                    </div>

    )
    const Delivery = (
        <>
            {loadingDeliver ? (
                <LoadingBox />
            ) : successDeliver ? (
                <MessageBox variant="success">
                    Dados enviados com sucesso
                </MessageBox>
            ) : errorDeliver ? (
                <MessageBox>
                    Ocorreu um erro!
                </MessageBox>
            ) : (
                <>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="company">
                                    <Form.Label>Transportadora</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="transportadora"
                                        value={shippingCompany}
                                        placeholder='Correios'
                                        required
                                        onChange={(e) => setShippingCompany(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="code">
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="codigo"
                                        value={trackingCode}
                                        placeholder='NB162402112BR'
                                        required
                                        onChange={(e) => setTrackingCode(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="linkShipping">
                                    <Form.Label>Link (opcional)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="linkShipping"
                                        value={linkShipping}
                                        placeholder='https://...'
                                        required
                                        onChange={(e) => setLinkShipping(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    <div className="d-grid">
                        <Button type="button" className='d-flex flex-row justify-content-center' onClick={deliverOrder}>
                            Enviar
                        </Button>
                    </div>
                </>
            )}
        </>
    )

    switch (typeRender) {
        case 'CREDIT_CARD':
            return CardPay
        case 'BILLET':
            return BilletPay
        case 'PIX':
            return PixPay
        case 'delivery':
            return Delivery
        default:
            <MessageBox>
                Não conseguimos carregar a informação. Tente novamente em alguns minutos ⌛
            </MessageBox>
    }
}

export default ModalBox;