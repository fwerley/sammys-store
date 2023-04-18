import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
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
import { getError } from '../utils';

import LoadingBox from '../components/LoadingBox';
import axios from 'axios';

export default function SigninScreen() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector(selectUser);
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    window.location.replace('http://localhost:5000/auth/facebook')
  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <h1 className="my-3">Login</h1>
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
          <Button type="submit" disabled={loading} className='w-25'>
            {loading ? <LoadingBox /> : 'Login'}
          </Button>
        </div>
        <div className='social-media mb-3'>
          <span>OU</span>
        </div>
        <div className="d-flex justify-content-center mb-3 social-fb">
          <Button type="button" onClick={redirectAuthFB}>
            <i className="fa-brands fa-facebook"></i>&nbsp;
            Continuar com o Facebook
          </Button>
        </div>
        <div className="mb-1">
          Novo por aqui?{' '}
          <Link to={`/signup?redirect=${redirect}`}>Criar conta</Link>
        </div>
        <div className="mb-1">
          Esqueceu a senha?&nbsp;
          <Link to='/forget-password'>Recuperar</Link>
        </div>
      </Form>
    </Container>
  );
}
