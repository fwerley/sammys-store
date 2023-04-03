import React, { useState } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'

import { useDispatch, useSelector } from 'react-redux'
import { selectUser, uploadFailLogo, uploadRequestLogo, uploadSuccessLogo, userSignin, userUpdateFail, userUpdateRequest, userUpdateSuccess } from '../slice/userSlice'
import { getError } from '../utils'
import { useNavigate } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import LoadingBox from '../components/LoadingBox'

export default function ProfileScreen() {

    const { userInfo, loadingUpdate } = useSelector(selectUser);
    const dispatch = useDispatch();

    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState('')
    const [combinePassword, setCombinePassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [sellerName, setSellerName] = useState(userInfo.seller ? userInfo.seller.name : '')
    const [sellerLogo, setSellerLogo] = useState(userInfo.seller ? userInfo.seller.logo : '')
    const [sellerDescription, setSellerDescription] = useState(userInfo.seller ? userInfo.seller.description : '')

    const inputElement = document.getElementById("confirmPassword");
    const inputElement2 = document.getElementById("password");

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
            dispatch(uploadRequestLogo());
            const { data } = await axios.post(`/api/upload/image`, bodyFormData, {
                headers: {
                    'Content-Type': 'multipart-form-data',
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch(uploadSuccessLogo());
            setSellerLogo(data.secure_url);
            toast.success('Upload realizado com sucesso. Clique em Atualizar para aplicar as modificações');
        } catch (err) {
            toast.error(getError(err));
            dispatch(uploadFailLogo(getError(err)))
        }
    }

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
        dispatch(userUpdateRequest());
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password,
                    sellerName,
                    sellerLogo,
                    sellerDescription
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
        <div className={userInfo.isSeller ? 'container' : 'container small-container'}>
            <Helmet>
                <title>Minha conta</title>
            </Helmet>
            <h1>Minha conta</h1>
            <hr />
            <form onSubmit={submitHandler}>
                <Row>
                    <Col md={userInfo.isSeller ? 4 : 12}>
                        <h2>Meus dados</h2>
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
                    </Col>
                    {userInfo.isSeller && (
                        <>
                            <Col md={1}></Col>
                            <Col className='border-start'>
                                <h2>Minha Loja</h2>
                                <Form.Group className="mb-3" controlId="sellerName">
                                    <Form.Label>Nome da loja</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={sellerName}
                                        onChange={(e) => setSellerName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="sellerLogo">
                                    <Form.Label>Logo da loja</Form.Label>
                                    <Row>
                                        <Col sm={4}>
                                            <Card>
                                                <Card.Img
                                                    variant='top'
                                                    className='img-fluid'
                                                    src={sellerLogo}
                                                    alt='product' />
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Form.Label>Upload Logo</Form.Label>
                                    <Form.Control
                                        type='file'
                                        onChange={uploadFileHandler}
                                    />
                                    {loadingUpdate && <LoadingBox />}
                                    {/* <Form.Control
                                type='text'
                                value={sellerLogo}
                                onChange={(e) => setSellerLogo(e.target.value)}
                                required
                            /> */}
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="sellerDescription">
                                    <Form.Label>Descrição da loja</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={sellerDescription}
                                        onChange={(e) => setSellerDescription(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </>
                    )}
                </Row>
                <Form.Group>
                    <div className='mb-3'>
                        <Button type="submit">Atualizar</Button>
                    </div>
                </Form.Group>
            </form>
        </div>
    )
}
