import axios from 'axios'
import React, { useEffect } from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import HelmetSEO from '../components/HelmetSEO'
import LoadingBox from '../components/LoadingBox'
import { selectProducts } from '../slice/productsSlice'
import { getError } from '../utils'
import { selectSeller, sellerFetch, sellerFetchFail, sellerFetchSuccess } from '../slice/sellerSlice'
import Rating from '../components/Rating'
import MessageBox from '../components/MessageBox'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import SellerProducts from '../components/SellerProducts'

export default function SellerScreen() {
    const dispatch = useDispatch();
    const { loading, seller, error } = useSelector(selectSeller)
    const params = useParams();
    const { id: sellerId } = params;

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                dispatch(sellerFetch())
                const { data } = await axios.get(`/api/sellers/${sellerId}`)
                dispatch(sellerFetchSuccess(data))
            } catch (error) {
                toast.error(getError(error));
                dispatch(sellerFetchFail(getError(error)));
            }
        }
        fetchSeller();
    }, [dispatch, sellerId])

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
        <Container>
            <HelmetSEO
            />
            <Row>
                <Col>
                    <div className='gradient-custom-2 rounded theme-store'>
                        <img src='https://lh3.googleusercontent.com/DY9sdxLtbScygZsehAUbz2fDCsW2WdUwG0k8K48-O68mkRU_tI3yPpZwzDNK_lXhqeldLKH61wljj1xtq23XmiQ3Zgo=w640-h400-e365-rj-sc0x00ffffff' alt='bbbb' />
                    </div>
                </Col>
            </Row>
            <Row className='my-4'>
                <Col md={2} className='logo-seller'>
                    <div className=''>
                        <img src={seller.logo} className="img-fluid mx-1 my-1 p-1 rounded-circle border shadow-sm" alt={seller.name} />
                    </div>
                </Col>
                <Col>
                    <Card className='shadow-sm border-0'>
                        <Card.Body>
                            <div className='body-info-seller justify-content-around align-items-center'>
                                <div className='seller-info w-75'>
                                    <Card.Text>
                                        <h4>{seller.name}</h4>
                                        {seller.description}
                                    </Card.Text>
                                    <Rating rati1ng={seller.rating} numReviews={seller.numReviews} />
                                </div>
                                <div className='seller-flw'>
                                    <Button variant='primary'>
                                        seguir
                                    </Button>
                                </div>
                            </div>
                            {/* <Link to={`mailto:${seller.user.email}`}></Link> */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <div className='tab-seller'>
                    <Tabs
                        defaultActiveKey="products"
                        id="seller-tab"
                        className="mb-3"
                    >
                        <Tab eventKey="products" title="Produtos">
                            <SellerProducts />
                        </Tab>
                        <Tab eventKey="best-sellers" title="Mais vendidos">
                            Top vendas
                            {/* <Sonnet /> */}
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
                </div>
            </Row>
        </Container>
    )
}
