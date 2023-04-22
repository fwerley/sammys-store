import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Cards from 'react-credit-cards';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputMask from 'react-input-mask';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useEffect, useState } from 'react';
import { paymentFail, paymentRequest, paymentReset, paymentSuccess, selectPayment } from '../slice/paymentSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../slice/userSlice';
import { selectOrder } from '../slice/orderSlice';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import MessageBox from './MessageBox';
import LoadingBox from './LoadingBox';
import { toast } from 'react-toastify';
import { formatCoin, getError } from '../utils';


function ModalBox(props) {
    return (
        <Modal
            {...props}
            size={`${props.type === 'BILLET' ? 'sm' : ''}`}
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
                {ComponentPay(props.type)}
            </Modal.Body>
        </Modal>
    )
}

const ComponentPay = (typeRender) => {
    const [cvc, setCvc] = useState('');
    const [expiry, setExpiry] = useState('');
    const [focus, setFocus] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [installments, setInstallments] = useState([]);
    const [taxPrice, setTaxPrice] = useState(0);
    const dispatch = useDispatch();
    const { order } = useSelector(selectOrder);
    const { userInfo } = useSelector(selectUser);
    const { successPay, loadingPay, errorPay } = useSelector(selectPayment)

    const [cpf, setCPF] = useState('');

    const handleInputFocus = (e) => {
        setFocus(e.target.name);
    };

    const arrayInstallments = () => {
        let value = order.orderPrice.totalPrice;
        const stringSelect = [];
        for (let index = 0; index < 12; index++) {
            let correctValue = (value / (index + 1)) + (value / (index + 1)) * 0.05 * index;
            stringSelect.push({
                label: `Parcela ${(index + 1)} x ${formatCoin(correctValue)}`,
                installments: index + 1,
                value: correctValue.toFixed(2) * (index + 1),
                taxPrice: correctValue.toFixed(2) * (index + 1) - value
            })
        }
        return stringSelect
    }

    useEffect(() => {
        setTaxPrice(installments[0]?.taxPrice);
    }, [installments])

    const payOrder = async () => {
        try {
            if (!cpf) {
                toast.warning('O campo CPF é obrigatório');
                return;
            }

            dispatch(paymentRequest())

            // Se foi feito compra parcelada, o preço deve ser atualiado com acrescimo da taxa
            // if (taxPrice !== order.orderPrice.taxPrice) {
            //     await axios.put(
            //         `/api/orders/${order.id}`,
            //         {
            //             taxPrice,
            //             totalPrice: order.orderPrice.itemsPrice + order.orderPrice.shippingPrice + taxPrice
            //         },
            //         { headers: { authorization: `Bearer ${userInfo.token}` } }
            //     )
            // }
            // Aguardar atualização de taxa do BD
            await axios.post(
                `/api/orders/${order.id}/pay`,
                {
                    paymentType: order.paymentMethod,
                    installments: order.paymentMethod === 'BILLET' ? 1 : installments[0].installments,
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
                                                <Col sm={6}>
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
                                                <Col sm={6}>
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

    switch (typeRender) {
        case 'CREDIT_CARD':
            return CardPay
        case 'BILLET':
            return BilletPay
        default:
            <MessageBox>
                Não conseguimos carregar a informação. Tente novamente em alguns minutos ⌛
            </MessageBox>
    }
}

export default ModalBox;