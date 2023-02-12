import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../slice/userSlice';
import { fetchFailureProduct, fetchRequestProduct, fetchSuccessProduct, selectProduct, updateFailureProduct, updateRequestProduct, updateSuccessProduct } from '../slice/productSlice';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function ProductEditScreen() {
    const params = useParams();
    const navigate = useNavigate()
    const { id: productId } = params;
    const dispatch = useDispatch();
    const { userInfo } = useSelector(selectUser);
    const { loading, error, product } = useSelector(selectProduct);

    const [name, setName] = useState(product.name || '');
    const [slug, setSlug] = useState(product.slug || '');
    const [price, setPrice] = useState(String(product.price) || '');
    const [image, setImage] = useState(product.image || '');
    const [category, setCategory] = useState(product.category || '');
    const [countInStock, setCountInStock] = useState(String(product.countInStock) || '');
    const [brand, setBrand] = useState(product.brand || '');
    const [description, setDescription] = useState(product.description || '');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateRequestProduct());
            const { data } = await axios.put(`/api/products/${productId}`, {
                id: productId,
                name,
                slug,
                price: Number(price),
                image,
                category,
                countInStock: Number(countInStock),
                brand,
                description
            }, {
                headers: { authorization: `Bearer ${userInfo.token}` }
            })
            dispatch(updateSuccessProduct(data));
            toast.success('Dados atualizados com sucesso');
            navigate('/admin/products');
        } catch (err) {
            toast.error(getError(err));
            dispatch(updateFailureProduct(getError(err)))
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchRequestProduct());
                const { data } = await axios.get(`/api/products/${productId}`);
                setName(data.name);
                setSlug(data.slug);
                setPrice(data.price);
                setImage(data.image);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setBrand(data.brand);
                setDescription(data.description);
                dispatch(fetchSuccessProduct(data));
            } catch (error) {
                dispatch(fetchFailureProduct(getError(error)));
                toast.error(getError(error))
            }
        }
        if (productId && productId !== product.id) {
            fetchData();
        }
    }, [product, userInfo, productId, dispatch])

    return (
        <Container className='small-container'>
            <Helmet>
                <title>
                    Editar Produto - {productId}
                </title>
            </Helmet>
            <h1>Editar Produto - {productId}</h1>
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
                    <Form.Group className='mb-3' controlId='slug'>
                        <Form.Label>Identificador</Form.Label>
                        <Form.Control
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='price'>
                        <Form.Label>Preço</Form.Label>
                        <Form.Control
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='image'>
                        <Form.Label>Imagem</Form.Label>
                        <Form.Control
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='category'>
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='countInStock'>
                        <Form.Label>Estoque</Form.Label>
                        <Form.Control
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='brand'>
                        <Form.Label>Marca</Form.Label>
                        <Form.Control
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='description'>
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <div className='mb-3'>
                        <Button disabled={loading} type='submit'>Atualizar</Button>
                        {loading && <LoadingBox />}
                    </div>
                </Form>
            )}
        </Container>
    )
}
