import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../slice/userSlice';
import { fetchFailureProduct, fetchRequestProduct, fetchSuccessProduct, selectProduct, updateFailureProduct, updateRequestProduct, updateSuccessProduct, uploadFailureProduct, uploadRequestProduct, uploadSuccessProduct } from '../slice/productSlice';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
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
    const { loading, error, product, loadingUpload } = useSelector(selectProduct);

    const [name, setName] = useState(product.name || '');
    const [slug, setSlug] = useState(product.slug || '');
    const [price, setPrice] = useState(String(product.price) || '');
    const [image, setImage] = useState(product.image || '');
    const [images, setImages] = useState(product.images || []);
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
                images,
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

    const uploadFileHandler = async (e, forImages) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        try {
            dispatch(uploadRequestProduct());
            const { data } = await axios.post(`/api/upload/image`, bodyFormData, {
                headers: {
                    'Content-Type': 'multipart-form-data',
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch(uploadSuccessProduct());
            if (forImages) {
                setImages([...images, data.secure_url])
            } else {
                setImage(data.secure_url);
            }
            toast.success('Upload realizado com sucesso. Clique em Atualizar para aplicar as modificações');
        } catch (err) {
            toast.error(getError(err));
            dispatch(uploadFailureProduct(getError(err)))
        }
    }

    const deleteFileHandler = async (fileName) => {
        setImages(images.filter((x) => x !== fileName))
        toast.success('Iamgem removida com sucesso. Clique em Atualizar para aplicar as modificações')
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
                setImages(data.images);
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
                        <Row>
                            <Col sm={4}>
                                <Card>
                                    <Card.Img
                                        variant='top'
                                        className='img-fluid'
                                        src={image}
                                        alt='product' />
                                </Card>
                            </Col>
                        </Row>

                        {/* <Form.Control
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                        /> */}
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='imageFile'>
                        <Form.Label>Upload Imagem</Form.Label>
                        <Form.Control
                            type='file'
                            onChange={uploadFileHandler}
                        />
                        {loadingUpload && <LoadingBox />}
                    </Form.Group>
                    <hr />
                    <Form.Group className='' controlId='additionalImages'>
                        <Form.Label>Imagens adicionais</Form.Label>
                        {images.length === 0 && <MessageBox>Sem imagens</MessageBox>}
                        <ListGroup variant='flush'>
                            <Row>
                                {images.map((x) => (
                                    <Col sm={3} key={x}>
                                        <ListGroup.Item>
                                            <Card>
                                                <Card.Img
                                                    variant='top'
                                                    className='img-fluid'
                                                    src={x}
                                                    alt='product' />
                                            </Card>
                                            <Button variant='light' onClick={() => deleteFileHandler(x)}>
                                                <i className='fa fa-times-circle' />
                                            </Button>
                                        </ListGroup.Item>
                                    </Col>
                                ))}
                            </Row>
                        </ListGroup>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='additionalImageFile'>
                        <Form.Label>Upload imagens adicionais</Form.Label>
                        <Form.Control
                            type='file'
                            onChange={(e) => uploadFileHandler(e, true)}
                        />
                        {loadingUpload && <LoadingBox />}
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
