import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { selectUser } from '../slice/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';

export default function ForgetPasswordScreen() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { userInfo } = useSelector(selectUser);

    useEffect(() => {
        if (userInfo) {
            navigate('/')
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post('/api/users/forget-password', {
                email
            });
            toast.success(data.message);
            setLoading(false);
        } catch (err) {
            toast.error(getError(err));
            setLoading(false);
        }
    }

    return (
        <Container className='small-container'>
            <Helmet>
                <title>Recuperar senha</title>
            </Helmet>
            <h1 className='my-3'>Recuperar senha</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="emil"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit" disabled={loading}>
                        {loading ? <LoadingBox /> : 'Enviar'}
                    </Button>
                </div>
            </Form>
        </Container>
    )
}
