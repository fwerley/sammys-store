import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetUser,
  selectUser,
  userFailure,
  userResquest,
  userSignin,
} from '../slice/userSlice';
import { toast } from 'react-toastify';
import { getError } from '../utils';

import LoadingBox from '../components/LoadingBox';

export default function SignupScreen() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector(selectUser);
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/signin';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Senhas incompatíveis');
      return;
    }
    dispatch(userResquest());
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      toast.success(data.message);
      dispatch(resetUser())
      // dispatch(userSignin(data));
      // localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/signin');
    } catch (error) {
      toast.error(getError(error));
      dispatch(userFailure(error.message));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Criar conta</title>
      </Helmet>
      <h1 className="my-3">Criar conta</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
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
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirmar senha</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingBox /> : 'Criar conta'}
          </Button>
        </div>
        <div className="mb-3">
          Já tem uma conta?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Login</Link>
        </div>
      </Form>
    </Container>
  );
}
