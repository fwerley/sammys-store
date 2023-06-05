import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../slice/userSlice';
import {
    fetchFailureProduct,
    fetchRequestProduct,
    fetchSuccessProduct,
    selectProduct,
    updateFailureProduct,
    updateRequestProduct,
    updateSuccessProduct,
    uploadFailureProduct,
    uploadRequestProduct,
    uploadSuccessProduct
} from '../slice/productSlice';
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
import { CirclePicker, TwitterPicker } from 'react-color';

import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import CropImage from '../components/CropImage';
import DraftEditor from '../components/DraftEditor';

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
    const [sizes, setSizes] = useState((product.sizes && product.sizes.length > 0 && true) || false);
    const [arraySizes, setArraySizes] = useState(product.sizes || []);
    const [colors, setColors] = useState((product.colors && product.colors.length && true) || false);
    const [arrayColors, setArrayColors] = useState(product.colors || []);
    const [variant, setVariant] = useState((product.variants && product.variants.length && true) || false);
    const [arrayVariants, setArrayVariants] = useState(product.variants || []);
    const [category, setCategory] = useState(product.category || '');
    const [countInStock, setCountInStock] = useState(String(product.countInStock) || '');
    const [brand, setBrand] = useState(product.brand || '');
    const [description, setDescription] = useState(product.description || '');
    const [fullDescription, setFullDescription] = useState(product.fullDescription || '');

    const defaultColorsPicker = [
        "#f44336", "#e91e63", "#FFFFFF", "#9c27b0",
        "#673ab7", "#3f51b5", "#2196f3", "#03a9f4",
        "#00bcd4", "#009688", "#4caf50", "#8bc34a",
        "#cddc39", "#ffeb3b", "#ffc107", "#ff9800",
        "#ff5722", "#795548"
    ]

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
                sizes: arraySizes,
                colors: arrayColors,
                variants: arrayVariants,
                category,
                countInStock: Number(countInStock),
                brand,
                description,
                fullDescription
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

    async function blobToFile(blob) {
        let response = await fetch(blob);
        let data = await response.blob();
        let metadata = {
            type: 'image/jpeg'
        };
        return new File([data], "image.jpg", metadata);
    }

    const uploadFileHandler = async (e, forImages) => {
        // const file = e.target.files[0];
        const file = await blobToFile(e)
        const bodyFormData = new FormData();
        bodyFormData.append('file', file);
        bodyFormData.append('folder', `sellers/${userInfo.seller.id}/products/${productId}`)
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

    const handleChange = (color, event) => {
        if (!colors) {
            return;
        }

        let colorFind = arrayColors.find((colorArray) => colorArray === color.hex)
        const newArrayColors = colorFind
            ? arrayColors.filter((colorFiltered) => colorFind !== colorFiltered)
            : [...arrayColors, color.hex]
        setArrayColors(
            newArrayColors
        )
    }

    const nameAndSlug = (e) => {
        setName(e.target.value);
        setSlug(e.target.value.replaceAll(" ", "-").toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
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
                setSizes(data.sizes.length > 0 ? true : false)
                setArraySizes(data.sizes)
                setVariant(data.variants.length > 0 ? true : false)
                setArrayVariants(data.variants)
                setColors(data.colors.length > 0 ? true : false)
                setArrayColors(data.colors)
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setBrand(data.brand);
                setDescription(data.description);
                setFullDescription(data.fullDescription)
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
        <Container className=''>
            <Helmet>
                <title>
                    Editar Produto - {productId}
                </title>
            </Helmet>
            <h2>Editar Produto - {productId}</h2>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Row className='mt-4'>
                        <Col md={6}>
                            <h4>Infomrações do item</h4>
                            <Form.Group className='mb-3' controlId='name'>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    value={name}
                                    onChange={nameAndSlug}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='slug'>
                                <Form.Label>Identificador</Form.Label>
                                <Form.Control
                                    value={slug}
                                    disabled
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
                            <div className='mb-3 border p-2 rounded'>
                                <Form.Group className='mb-3' controlId='image'>
                                    <Form.Label><strong>Imagens</strong></Form.Label>
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
                                    <CropImage uploadFile={uploadFileHandler} />
                                    {/* <Form.Control
                                        type='file'
                                        onChange={uploadFileHandler}
                                    /> */}
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
                                    <CropImage uploadFile={(e) => uploadFileHandler(e, true)} />
                                    {/* <Form.Control
                                        type='file'
                                        onChange={(e) => uploadFileHandler(e, true)}
                                    /> */}
                                    {loadingUpload && <LoadingBox />}
                                </Form.Group>
                            </div>
                            <div className='mb-3 border p-2 rounded' >
                                <Form.Group controlId='sizes'>
                                    <Form.Label><strong>Caracteristicas</strong></Form.Label>
                                    <Row className='d-flex align-items-center'>
                                        <Col md={3}>
                                            <Form.Check
                                                type='switch'
                                                label="Tamanhos?"
                                                checked={sizes}
                                                onChange={() => setSizes(!sizes)}
                                            />
                                        </Col>
                                        <Col md={9}>
                                            <Form.Control
                                                disabled={!sizes}
                                                value={arraySizes}
                                                onChange={(e) => setArraySizes(e.target.value.split(','))}
                                                placeholder='Separe com virgula P, M, G ou 38, 39'
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId='variants'>
                                    <Row className='d-flex align-items-center my-2'>
                                        <Col md={3}>
                                            <Form.Check
                                                type='switch'
                                                label="Variantes?"
                                                checked={variant}
                                                onChange={() => setVariant(!variant)}
                                            />
                                        </Col>
                                        <Col md={9}>
                                            <Form.Control
                                                disabled={!variant}
                                                value={arrayVariants}
                                                onChange={(e) => setArrayVariants(e.target.value.split(','))}
                                                placeholder='Separe com virgula 64Gb, 128Gb'
                                            />
                                        </Col>
                                    </Row>
                                    <hr />
                                </Form.Group>
                                <Form.Group controlId='colors'>
                                    <Row>
                                        <Col md={7}>
                                            <Form.Check
                                                type='switch'
                                                label="Inserir cores?"
                                                checked={colors}
                                                onChange={() => setColors(!colors)}
                                            />
                                            <TwitterPicker
                                                colors={defaultColorsPicker}
                                                triangle='hide'
                                                disabled={colors}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col md={5}>
                                            <CirclePicker
                                                className='bg-light rounded shadow-sm p-2 mt-4'
                                                width='200px'
                                                colors={arrayColors}
                                                disabled={colors}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </div>
                            <Form.Group className='mb-3' controlId='category'>
                                <Row>
                                    <Col>
                                        <Form.Label>Categoria</Form.Label>
                                        <Form.Control
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label>Subcategoria</Form.Label>
                                        <Form.Control
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        />
                                    </Col>
                                </Row>
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
                                    as='textarea'
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <h4>Descrição detalhada do item</h4>
                            {fullDescription === '' ? <LoadingBox /> : <DraftEditor setDescription={setFullDescription} value={fullDescription} />}
                        </Col>
                    </Row>

                    <div className='mb-3'>
                        <Button disabled={loading} type='submit'>Atualizar</Button>
                        {loading && <LoadingBox />}
                    </div>
                </Form>
            )}
        </Container>
    )
}
