import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUser } from '../slice/userSlice';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';

export default function ResetPasswordScreen() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [combinePassword, setCombinePassword] = useState(false)
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { userInfo } = useSelector(selectUser);

    const inputElement = document.getElementById("confirmPassword");
    const inputElement2 = document.getElementById("password");

    useEffect(() => {
        if (userInfo || !token) {
            navigate('/')
        }
    }, [navigate, userInfo, token]);

    const resetInputpassword = () => {
        inputElement.style.borderColor = ''
        inputElement2.style.borderColor = ''
    }

    const checkPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (password !== e.target.value) {
            if (e.target.value !== '') {
                inputElement.style.borderColor = "red";
                inputElement2.style.borderColor = "red";
                setCombinePassword(false);
            } else {
                resetInputpassword();
                setCombinePassword(false);
            }
        } else {
            inputElement.style.borderColor = 'green'
            inputElement2.style.borderColor = 'green'
            setCombinePassword(true);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!combinePassword) {
            toast.warning("Revise a confirmação de senha e tente novamente.")
            return
        }
        try {
            const { data } = await axios.post(
                '/api/users/reset-password', {
                password,
                token
            })
            navigate('/signin');
            toast.success('Senha atualizada com sucesso')
        } catch (error) {
            toast.error(getError(error));
        }
    }

    return (
        <Container className='small-container'>
            <Helmet>
                <title>Atualizar senha</title>
            </Helmet>
            <h1 className='my-3'>Atualizar senha</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirmar senha</Form.Label>
                    <Form.Control
                        type='password'
                        value={confirmPassword}
                        onChange={checkPassword}
                        onFocus={checkPassword}
                        onBlur={resetInputpassword}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <div className='mb-3'>
                        <Button type="submit">Atualizar</Button>
                    </div>
                </Form.Group>
            </Form>
        </Container>
    )
}
