import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'

import { useDispatch, useSelector } from 'react-redux'
import { selectUser, userSignin, userUpdateFail, userUpdateResquest, userUpdateSuccess } from '../slice/userSlice'
import { getError } from '../utils'
import { useNavigate } from 'react-router-dom'

export default function ProfileScreen() {

    const { userInfo } = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState('')
    const [combinePassword, setCombinePassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')

    const inputElement = document.getElementById("confirmPassword");
    const inputElement2 = document.getElementById("password");


    const resetInputpassword = () => {
        inputElement.style.borderColor = ''
        inputElement2.style.borderColor = ''
    }

    const checkPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (password !== e.target.value) {
            if (e.target.value != '') {
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
        dispatch(userUpdateResquest());
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password
                }, { headers: { authorization: `Bearer ${userInfo.token}` } }
            )
            dispatch(userSignin(data));
            localStorage.setItem('userInfo', JSON.stringify(data));
            dispatch(userUpdateSuccess());
            toast.success('Seus dados foram atualizados')
        } catch (error) {
            dispatch(userUpdateFail());
            toast.error(getError(error));
        }
    }


    return (
        <div className='container small-container'>
            <Helmet>
                <title>Meus dados</title>
            </Helmet>
            <h1>Meus dados</h1>
            <form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
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
                        // id='my-password'
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
            </form>
        </div>
    )
}
