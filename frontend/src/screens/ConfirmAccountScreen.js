import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUser } from '../slice/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';

export default function ConfirmAccountScreen() {

    const navigate = useNavigate();
    const { token } = useParams();
    const [loading, setLoading] = useState(true);
    const [verify, setVerify] = useState(false);
    const { userInfo } = useSelector(selectUser);

    useEffect(() => {
        const confirmAccount = async () => {
            try {
                await axios.post(
                    '/api/users/confirm-account', {
                    token
                })
                setVerify(true);
                setLoading(false);
                // navigate('/signin');
                // toast.success('Senha atualizada com sucesso')
            } catch (error) {
                setLoading(false);
                setVerify(false);
                toast.error(getError(error));
            }
        }
        if (userInfo || !token) {
            navigate('/')
        } else {
            confirmAccount();
        }
    }, [navigate, userInfo, token]);

    return (
        <Container className="small-container">
            <Helmet>
                <title>Verificação de email</title>
            </Helmet>
            {loading ? <LoadingBox /> : verify ? (
                <>
                    <h1 className="my-5">
                        Email verificado com sucesso
                    </h1>
                    <div className="success-animation" style={{ fontSize: 24 }}>
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke-linejoin="round" stroke-linecap="round" />
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-linejoin="round" stroke-linecap="round" />
                        </svg>
                    </div>
                </>

            ) : (
                <>
                    <h1 className="my-5">
                        A verificação do seu email não foi concluída
                    </h1>
                    <div className='d-flex align-items-center justify-content-center'>
                        <i className="fas fa-exclamation-triangle" style={{ color: "#c53916", fontSize: 76 }}></i>
                    </div>
                </>
            )}
        </Container>
    )
}
