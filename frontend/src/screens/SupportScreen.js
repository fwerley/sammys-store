import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Send } from 'react-bootstrap-icons'
    ;
import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectUser as userData } from '../slice/userSlice';

let allUsers = [];
let allMessages = [];
let allSelectedUser = {};
const ENDPOINT = window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

export default function SupportScreen() {
    const [selectedUser, setSelectedUser] = useState({});
    const [socket, setSocket] = useState(null);
    const uiMessageRef = useRef(null);
    const [messageBody, setMessageBody] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const { userInfo } = useSelector(userData);

    useEffect(() => {
        if (uiMessageRef.current) {
            uiMessageRef.current.scrollBy({
                top: uiMessageRef.current.clientHeight,
                left: 0,
                behavior: 'smooth'
            })
        }
        if (!socket) {
            const sk = socketIOClient(ENDPOINT);
            setSocket(sk);
            sk.emit('onLogin', {
                id: userInfo.id,
                name: userInfo.name,
                isAdmin: userInfo.isAdmin
            });
            sk.on('message', (data) => {
                if (allSelectedUser.id === data.id) {
                    allMessages = [...allMessages, data];
                } else {
                    const existUser = allUsers.find((user) => user.id === data.id);
                    if (existUser) {
                        allUsers = allUsers.map((user) =>
                            user.id === existUser.id ? { ...user, unread: true } : user
                        )
                        setUsers(allUsers);
                    }
                }
                setMessages(allMessages);
            });
            sk.on('updateUser', (updatedUser) => {
                const existUser = allUsers.find((user) => user.id === updatedUser.id);
                if (existUser) {
                    allUsers = allUsers.map((user) =>
                        user.id === existUser.id ? updatedUser : user
                    );
                    setUsers(allUsers)
                } else {
                    allUsers = [...allUsers, updatedUser];
                    setUsers(allUsers);
                }
            });
            sk.on('listUsers', (updatedUsers) => {
                allUsers = updatedUsers;
                setUsers(allUsers)
            });
            sk.on('selectUser', (user) => {
                allMessages = user.messages;
                setMessages(allMessages);
            })
        }
    }, [messages, socket, users, userInfo]);

    const selectUser = (user) => {
        allSelectedUser = user;
        setSelectedUser(allSelectedUser);
        const existUser = allUsers.find((x) => x.id === user.id);
        if (existUser) {
            allUsers = allUsers.map((x) =>
                x.id === existUser.id ? { ...x, unread: false } : x
            );
            setUsers(allUsers);
        }
        socket.emit('onUserSelected', user);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (!messageBody.trim()) {
            alert('Escreva uma mensagem');
        } else {
            allMessages = [
                ...allMessages,
                { body: messageBody, name: userInfo.name }
            ]
            setMessages(allMessages);
            setMessageBody('');
            setTimeout(() => {
                socket.emit('onMessage', {
                    body: messageBody,
                    name: userInfo.name,
                    isAdmin: userInfo.isAdmin,
                    id: selectedUser.id
                })
            }, 1000)
        }
    }

    return (
        <>
            <Row>
                <Col md={4}>
                    {users.filter((x) => x.id !== userInfo.id).length === 0 && (
                        <MessageBox>Sem usuários online no momento</MessageBox>
                    )}
                    <ListGroup className='list-users-chat'>
                        {users
                            .filter((x) => x.id !== userInfo.id)
                            .map((user) => (
                                <ListGroup.Item
                                    key={user.id}
                                    className={user.id === selectedUser.id ? 'selected d-flex justify-content-between align-items-center' : 'd-flex justify-content-between align-items-center'}
                                >
                                    <Button
                                        type='button'
                                        onClick={() => selectUser(user)}
                                        variant='light'
                                    >
                                        {user.name}
                                    </Button>
                                    <div className={user.unread ? 'blob blue' : user.online ? 'blob blob-green' : 'blob blob-red'}></div>
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                </Col>
                <Col md={8}>
                    {!selectedUser.id ? (
                        <MessageBox> Selecione um usuário para iniciar o chat</MessageBox>
                    ) : (
                        <>
                            <Row>
                                <strong>Chat com {selectedUser.name}</strong>
                            </Row>
                            <div ref={uiMessageRef} className='support-message py-2 px-2'>
                                {messages.length === 0 && (<MessageBox variant='info'>Sem mensagens</MessageBox>)}
                                {messages.map((msg, index) => (
                                    <ListGroup className={msg.name === userInfo.name ? 'message-logged' : 'message-nlogged'} key={index}>
                                        <ListGroup.Item>
                                            {msg.name === userInfo.name ? (
                                                <div className='d-inline-flex'>
                                                    <div className='me-1'>{msg.body}</div> <strong>{`:${msg.name}`}</strong>
                                                </div>
                                            ) : (
                                                <div>
                                                    <strong>{`${msg.name}: `}</strong> {msg.body}
                                                </div>
                                            )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                ))}
                            </div>
                            <Row>
                                <form onSubmit={submitHandler} className='my-4'>
                                    <div className='d-flex justify-content-between input-message'>
                                        <Form.Group controlId='prompt'>
                                            <Form.Control
                                                type='text'
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
                            </Row>
                        </>
                    )}
                </Col>
            </Row>
        </>
    )
}
