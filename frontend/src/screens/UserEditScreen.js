import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { selectUser, userFailure, userResquest, userResquestSuccess, userUpdateFail, userUpdateRequest, userUpdateSuccess } from '../slice/userSlice'

export default function UserEditScreen() {
    const params = useParams();
    const { id: userId } = params;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [seller, setSeller] = useState({});

    const { loadingUpdate, error, loading, userInfo } = useSelector(selectUser);

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(userResquest());
                const { data } = await axios.get(`/api/users/${userId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                setIsSeller(data.isSeller);
                setSeller(data.seller);
                dispatch(userResquestSuccess())
            } catch (err) {
                dispatch(userFailure(getError(err)))
            }
        }
        fetchData();
    }, [userId, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(userUpdateRequest());
            const { data } = await axios.put(`/api/users/${userId}`, {
                name, email, isAdmin, isSeller
            }, {
                headers: { authorization: `Bearer ${userInfo.token}` }
            })
            dispatch(userUpdateSuccess());
            toast.success('Usuário atualizado com sucesso');
            navigate('/admin/users');
        } catch (err) {
            dispatch(userUpdateFail(getError(err)));
            toast.error(getError(err));
        }
    }

    return (
        <Container className='small-container'>
            <Helmet>
                <title>
                    Editar Usuario - {userId}
                </title>
            </Helmet>
            <h1>Editar Usuario - {name}</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group className='mb-3' controlId='name'>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            value={email}
                            type='email'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Check
                        className='mb-3'
                        type='checkbox'
                        id='isAdmin'
                        label='É Admin?'
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <Form.Check
                        className='mb-3'
                        type='checkbox'
                        id='isSeller'
                        label='É Vendendor?'
                        checked={isSeller}
                        onChange={(e) => setIsSeller(e.target.checked)}
                    />
                    {seller && (
                        <div className='mb-3'>
                            <Row>
                                <Col sm={2}>
                                    <Card>
                                        <Card.Img
                                            variant='top'
                                            className='img-fluid'
                                            src={seller.logo}
                                            alt='Logo loja' />
                                    </Card>
                                </Col>
                                <Col md={10}>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>
                                                    <strong>{seller.name}</strong>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>
                                                    {seller.description}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </div>
                    )}
                    <div className='mb-3'>
                        <Button disabled={loadingUpdate} type='submit'>Atualizar</Button>
                        {loadingUpdate && <LoadingBox />}
                    </div>
                </Form>
            )}
        </Container>
    )
}
