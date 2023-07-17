import React, { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

import {
  fetchFailureProduct,
  fetchRequestProduct,
  fetchSuccessProduct,
  reviewFail,
  reviewRequest,
  reviewSuccess,
  selectProduct,
} from '../slice/productSlice';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { formatCoin, formatedDate, getError } from '../utils';
import { addCartItem, addSeller, selectCart } from '../slice/cartSlice';
import HelmetSEO from '../components/HelmetSEO';
import { Cart3 } from 'react-bootstrap-icons';
import { selectUser } from '../slice/userSlice';
import { CirclePicker } from 'react-color';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

function ProductScreen() {

  let reviewRef = useRef();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [variant, setVariant] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [width, setWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const dispatch = useDispatch();

  const { product, loading, error, loadingCreateReview } = useSelector(selectProduct);
  const { userInfo } = useSelector(selectUser);
  const { cart, seller: sellerIdCart } = useSelector(selectCart);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchRequestProduct());
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch(fetchSuccessProduct(result.data));
      } catch (err) {
        dispatch(fetchFailureProduct(getError(err)));
      }
    };
    fetchData();
  }, [dispatch, slug]);

  const addToCartHandler = async () => {
    let productChooses = product;
    const existItem = cart.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product.id}`);
    if (data.countInStock < quantity) {
      window.alert('Desculpe. Quantidade insuficiente no estoque');
      return;
    }
    if (!color && product.colors && product.colors.length > 0) {
      window.alert('Selecione a cor do seu produto');
      return;
    } else {
      const existItem = cart.find((x) => x.id === product.id);
      const arrayColors = existItem && existItem.colorsSelect ? [...existItem.colorsSelect, color] : [color]
      productChooses = { ...productChooses, colorsSelect: arrayColors }
    }
    if (!size && product.sizes && product.sizes.length > 0) {
      window.alert('Selecione o tamanho do seu produto');
      return;
    } else {
      const existItem = cart.find((x) => x.id === product.id);
      const arraySizes = existItem && existItem.sizesSelect ? [...existItem.sizesSelect, size] : [size]
      productChooses = { ...productChooses, sizesSelect: arraySizes }
    }
    if (!variant && product.variants && product.variants.length > 0) {
      window.alert('Selecione a variação do produto');
      return;
    } else {
      const existItem = cart.find((x) => x.id === product.id);
      const arrayVariants = existItem && existItem.variantsSelect ? [...existItem.variantsSelect, variant] : [variant]
      productChooses = { ...productChooses, variantsSelect: arrayVariants }
    }
    !sellerIdCart && dispatch(addSeller(product.seller.id))
    dispatch(addCartItem({ ...productChooses, quantity }));
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Por favor, deixe uma avaliação e um comentário');
      return;
    }
    try {
      dispatch(reviewRequest())
      const { data } = await axios.post(`/api/products/${product.id}/reviews`,
        { rating, comment },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      )
      toast.success('Comentário enviado com sucesso');
      dispatch(reviewSuccess());
      dispatch(fetchSuccessProduct(data.product));
      setComment('');
      setRating(0)
      window.scrollTo({
        behavior: 'smooth',
        top: reviewRef.current.offsetTop
      })
    } catch (error) {
      console.log(error)
      toast.error(getError(error))
      dispatch(reviewFail())
    }
  }

  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(product.fullDescription)
  })

  return loading ? (
    <div className="d-flex justify-content-center">
      <LoadingBox />
    </div>
  ) : error ? (
    <>
      <Helmet>
        <title>Sammy's Store</title>
      </Helmet>
      <MessageBox variant="danger">{error}</MessageBox>
    </>
  ) : (
    <div>
      <Row>
        <Col md={5}>
          <img src={selectedImage || product.image} className="w-100" alt={product.name} />
        </Col>
        <Col md={4}>
          <ListGroup variante="flush">
            <ListGroup.Item>
              <HelmetSEO
                title={product.name}
                description={product.description}
                img={product.image}
                type='product'
              />
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <div className="d-flex card-images my-2">
              {product.images ?
                [product.image, ...product.images].map((x) => (
                  <Row key={x} className="my-1">
                    <Col md={2}>
                      <Card className='border-0 card-thumbnail'>
                        <Button
                          className='thumbnail'
                          type='button'
                          variant='light'
                          onClick={() => setSelectedImage(x)}
                        >
                          <Card.Img
                            variant='top'
                            src={x}
                            alt='product' />
                        </Button>
                      </Card>
                    </Col>
                  </Row>
                )) : ''
              }
            </div>
            <Form>
              {(product.colors && product.colors.length > 0 || product.sizes && product.sizes.length > 0) && (
                <ListGroup.Item>
                  <Row>
                    {product.colors && product.colors.length > 0 && (
                      <Col className={`d-flex align-items-center ${width < 768 && 'justify-content-center'} p-2`}>
                        {width > 768 && <>Cores&nbsp;&nbsp;</>}
                        <CirclePicker
                          className={`d-flex ${width < 768 && 'justify-content-center'}`}
                          // className={`bg-light ${width < 768 && 'justify-content-center'} rounded shadow-sm p-2`}
                          // width='98%'
                          color={color}
                          circleSize={width > 768 ? 16 : 26}
                          circleSpacing={14}
                          onChange={(e) => setColor(e.hex)}
                          colors={product.colors}
                        />
                      </Col>
                    )}
                    {product.sizes && product.sizes.length > 0 && (
                      <Col className={`d-flex align-items-center ${width < 768 && 'justify-content-center'} p-2`}>
                        Tamanhos&nbsp;
                        {product.sizes.map((sizeItem, i) => (
                          <>
                            <Form.Check
                              key={i}
                              type="radio"
                              value={sizeItem.trim()}
                              checked={size === sizeItem.trim()}
                              onChange={(e) => setSize(sizeItem.trim())}
                              label={sizeItem.trim()}
                            />&nbsp;
                          </>
                        ))}
                      </Col>
                    )}
                  </Row>
                </ ListGroup.Item>
              )}
              {product.variants && product.variants.length > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col className={`d-flex align-items-center ${width < 768 && 'justify-content-center'} p-2`}>
                      {product.variants.map((variantItem, i) => (
                        <>
                          <Form.Check
                            key={i}
                            type="radio"
                            value={variantItem.trim()}
                            checked={variant === variantItem.trim()}
                            onChange={(e) => setVariant(variantItem.trim())}
                            label={variantItem.trim()}
                          />&nbsp;
                        </>
                      ))}
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
            </Form>
            <ListGroup.Item>
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row className='d-flex align-items-center'>
                    {/* <Col md={4} xs={4}>Preço:</Col> */}
                    {/* <Col md={8} xs={8}> */}
                    <Col>
                      <h3 style={{ fontWeight: '600' }}>{formatCoin(product.price)}</h3>
                      <div className='product-price-desc'>
                        Em até 12x de {formatCoin((product.price + product.price * 0.2) / 12)}
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    {/* <Col>Status:</Col> */}
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">Em estoque</Badge>
                      ) : (
                        <Badge bg="danger">Sem estoque</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && width > 768 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary" className='shadow-sm'>
                        <Cart3 />&nbsp;
                        Adicionar
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
          <div className='payments-icons d-flex justify-content-center align-items-center flex-column my-2'>
            <div>
              <i className="fas fa-lock"></i>&nbsp;&nbsp;Compra protegida
            </div>
            <div className='d-flex justify-content-between'>
              <i className="fa-brands fa-pix" style={{ color: '#4BB8A9' }}></i>&nbsp;&nbsp;
              <i className="fab fa-cc-mastercard" style={{ color: '#ff5f00' }}></i>&nbsp;&nbsp;
              <i className="fab fa-cc-visa" style={{ color: '#1a1f71' }}></i>&nbsp;&nbsp;
              <i className="fas fa-barcode"></i>
            </div>
          </div>
          <Card id='seller-content'>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={4}>
                      <img src={product.seller && product.seller.logo} className="img-fluid mx-1 my-1 p-1 rounded-circle border shadow-sm" alt={product.seller && product.seller.name} style={{ width: '50px' }} />
                    </Col>
                    <Col md={5}><strong>{product.seller && product.seller.name}</strong></Col>
                    <Col md={3} className='d-flex justify-content-center'>
                      <Button variant='primary' className='shadow-sm'>
                        seguir
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.seller && product.seller.rating}
                    numReviews={product.seller && product.seller.numReviews}
                  ></Rating>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={9}>
          <Tabs
            defaultActiveKey="description"
            id="seller-tab"
            className="mt-4"
          >
            <Tab eventKey="description" title="Detalhes">
              <div dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
            </Tab>
            <Tab eventKey="avaliacao" title="Avaliações">
              <div className='my-3'>
                <h2 ref={reviewRef}>Avaliações</h2>
                <div className='mb-3'>
                  {product.reviews && product.reviews.length === 0 && (
                    <MessageBox>Ainda não há avaliações</MessageBox>
                  )}
                </div>
                <ListGroup>
                  {product.reviews?.map((review) => (
                    <ListGroup.Item key={review.id}>
                      <strong>{review.name}</strong>
                      <Rating rating={review.rating} caption=" " />
                      <p>{formatedDate(review.createdAt)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <div className='my-3'>
                  {userInfo ? (
                    <form onSubmit={submitHandler}>
                      <h2>Escrever minha avaliação</h2>
                      <Form.Group className="mb-3" controlId="rating">
                        <Form.Label>Avaliação</Form.Label>
                        <Form.Select
                          aria-label="Rating"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Selecionar...</option>
                          <option value="1">1 - Ruim</option>
                          <option value="2">2 - Regular</option>
                          <option value="3">3 - Bom</option>
                          <option value="4">4 - Muito bom</option>
                          <option value="5">5 - Excelente</option>
                        </Form.Select>
                      </Form.Group>
                      <FloatingLabel
                        controlId="floatingTextarea"
                        label="Comentário..."
                        className="mb-3"
                      >
                        <Form.Control
                          as="textarea"
                          placeholder='Deixe seu comentário aqui'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </FloatingLabel>
                      <div className='mb-3'>
                        <Button disabled={loadingCreateReview} type="submit">
                          Avaliar
                        </Button>
                        {loadingCreateReview && <LoadingBox />}
                      </div>
                    </form>
                  ) : (
                    <MessageBox>
                      Por favor, faça <Link to={`/signin?redirect=/product/${product.slug}`}>login</Link> para avaliar
                    </MessageBox>
                  )}
                </div>
              </div>
            </Tab>
            <Tab eventKey="following" title="Seguindo">
              Seguindo
              {/* <Sonnet /> */}
            </Tab>
            <Tab eventKey="followers" title="Seguidores">
              Seguidores
              {/* <Sonnet /> */}
            </Tab>
          </Tabs>
        </Col>
      </Row>
      {product.countInStock > 0 && width < 768 && (
        <div className="button-card-product-mobile">
          <Button onClick={addToCartHandler} variant="primary" className='shadow'>
            <Cart3 />&nbsp;
            Add ao carrinho
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
