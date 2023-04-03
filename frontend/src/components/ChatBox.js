import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import ListGroup from 'react-bootstrap/ListGroup';
import socketIOClient from 'socket.io-client';
import { Link, Send } from 'react-bootstrap-icons';

const ENDPOINT = window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

export default function ChatBox(props) {
    const { userInfo } = props;
    const [socket, setSocket] = useState(null);
    const uiMessageRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [messageBody, setMessageBody] = useState('')
    const [messages, setMessages] = useState([
        { name: 'Admin', body: 'Olá, você está com alguma dúvida 🤔?' }
    ]);

    useEffect(() => {
        if (uiMessageRef.current) {
            uiMessageRef.current.scrollBy({
                top: uiMessageRef.current.clientHeight,
                left: 0,
                behavior: 'smooth'
            })
        }
        if (socket) {
            socket.emit('onLogin', {
                id: userInfo.id,
                name: userInfo.name,
                isAdmin: userInfo.isAdmin
            });
            socket.on('message', (data) => {
                setMessages([...messages, { body: data.body, name: data.name }]);
            });
        }
    }, [messages, isOpen, socket, userInfo]);

    const supportHandler = () => {
        setIsOpen(true);
        const sk = socketIOClient(ENDPOINT);
        setSocket(sk);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (!messageBody.trim()) {
            alert('Escreva uma mensagem');
        } else {
            setMessages([...messages, { body: messageBody, name: userInfo.name }])
            setMessageBody('');
            setTimeout(() => {
                socket.emit('onMessage', {
                    body: messageBody,
                    name: userInfo.name,
                    isAdmin: userInfo.isAdmin,
                    id: userInfo.id
                })
            }, 1000)
        }
    }

    const closeHandler = () => {
        setIsOpen(false)
    }

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Suporte</Popover.Header>
            <Popover.Body>
                Se estiver com dúvidas, pode mandar mensagem 🤔
            </Popover.Body>
        </Popover>
    );

    return (
        <div className='chatbox'>
            {!isOpen ? (
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={popover}
                >
                    <Button
                        type='button'
                        className='shadow'
                        onClick={supportHandler}>
                        <span className='h4'>
                            <i className="fas fa-headset"></i>
                        </span>
                    </Button>
                </OverlayTrigger>
            ) : (
                <Card>
                    <Card.Header>
                        <div className='d-flex justify-content-between'>
                            <strong>Suporte</strong>
                            <Button type='button' variant='light' onClick={closeHandler} >
                                <i className="fas fa-times-circle" />
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body ref={uiMessageRef}>
                        {messages.map((msg, index) => (
                            <ListGroup className={msg.name === userInfo.name ? 'message-logged' : 'message-nlogged'} key={index} >
                                <ListGroup.Item>
                                    {msg.name === userInfo.name ? (
                                        <div className='d-inline-flex'>
                                            <div className='me-1'>{msg.body}</div> <strong>{`:${msg.name}`}</strong>
                                        </div>
                                    ) : (
                                        <div>
                                            <strong>{`${msg.name}: `}</strong>{msg.body}
                                        </div>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        ))}
                    </Card.Body>
                    <Card.Footer>
                        <form onSubmit={submitHandler} >
                            <div className='d-flex justify-content-between input-message'>
                                <Form.Group controlId='sendMessage'>
                                    <Form.Control
                                        type='text'
                                        className=''
                                        value={messageBody}
                                        onChange={(e) => setMessageBody(e.target.value)}
                                        placeholder='mensagem...'
                                    />
                                </Form.Group>
                                <Button type='submit'>
                                    <Send /> Enviar
                                </Button>
                            </div>
                        </form>
                    </Card.Footer>
                </Card>
            )}
        </div>
    )
}
