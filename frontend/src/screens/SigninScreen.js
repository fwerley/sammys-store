import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser,
  userFailure,
  userResquest,
  userSignin,
} from '../slice/userSlice';
import { toast } from 'react-toastify';
import { APP_ID_FB, getError } from '../utils';

import LoadingBox from '../components/LoadingBox';

export default function SigninScreen() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector(selectUser);
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const hostInUrl = new URLSearchParams(search).get('provider');
  const accessToken = new URLSearchParams(search).get('accessToken') || '';
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [dLoad, setDLaod] = useState(false);
  const [password, setPassword] = useState('');
  const [provider, setProvider] = useState(hostInUrl || '');
  const [urlAuthGG, setUrlAuthGG] = useState('');
  const [urlAuthFB, setUrlAuthFB] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(userResquest());
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      dispatch(userSignin(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect);
    } catch (error) {
      toast.error(getError(error));
      dispatch(userFailure(error.message));
    }
  };

  const redirectAuthFB = async () => {
    setDLaod(true);    
    window.location.replace(urlAuthFB)
  }

  const redirectAuthGG = async () => {
    setDLaod(true);
    setProvider('google')
    window.location.replace(urlAuthGG)
  }

  useEffect(() => {
    const request = async () => {
      setDLaod(true);
      try {
        const { data } = await Axios.get(`/api/auth_oauth/me?accessToken=${accessToken}&provider=${provider}`);
        dispatch(userSignin(data));
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate(redirect);
        setDLaod(false);
      } catch (error) {
        toast.error(getError(error));
        dispatch(userFailure(error.message));
        setDLaod(false);
      }
    }
    if (accessToken)
      request();
  }, [accessToken])

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    const getUrlfACEBOOKAuth = async () => {
      try {
        const { data } = await Axios.get(`/api/facebook/url-auth?redirect=${redirect}`)
        setUrlAuthFB(data)       
      } catch (error) {
        console.log(error)
      }
    }
    const getUrlGoogleAuth = async () => {
      try {
        const { data } = await Axios.get('/api/google/url-auth')
        setUrlAuthGG(data)       
      } catch (error) {
        console.log(error)
      }
    }
    getUrlGoogleAuth()
    getUrlfACEBOOKAuth()

  }, [navigate, redirect, userInfo]);

  return (
    <Container className="middle-container">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <h1 className="my-3">Login</h1>
      <Row>
        <Col md={6}>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="emil"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="mb-3">
              <Button type="submit" disabled={loading} className='w-50 shadow-sm'>
                {loading ? <LoadingBox /> : 'Login'}
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={6} className='d-flex align-items-center container-social'>
          <div className='social-media me-3'>
            <span>OU</span>
          </div>
          <div className='social-login'>
            <div className="d-flex justify-content-center mb-4 social-fb shadow-sm">
              <Button type="button" onClick={redirectAuthFB}>
                <i className="fa-brands fa-facebook"></i>&nbsp;
                Continuar com o Facebook
              </Button>
            </div>
            <div className="d-flex justify-content-center mb-3 social-gg shadow-sm">
              <Button type="button" onClick={redirectAuthGG}>
                <i className="fab fa-google"></i>&nbsp;
                Continuar com o Google
              </Button>
            </div>
          </div>
        </Col>

      </Row>
      <div className="mb-1">
        Novo por aqui?{' '}
        <Link to={`/signup?redirect=${redirect}`} style={{ textDecoration: 'underline' }}>Criar conta</Link>
      </div>
      <div className="mb-1">
        Esqueceu a senha?&nbsp;
        <Link to='/forget-password' style={{ textDecoration: 'underline' }}>Recuperar</Link>
      </div>
      <div id='spinner' className={`${dLoad ? '' : 'd-none'}`}>
        <i className="fa-solid fa-spinner fa-spin"></i>
      </div>
    </Container>
  );
}
