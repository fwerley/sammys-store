import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { fetchFail, fetchRequest, fetchSuccess, selectSearch } from '../slice/searchSlice';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import Product from './Product';
import { LinkContainer } from 'react-router-bootstrap';

const prices = [
    {
        name: 'R$ 1,00 a R$ 50,00',
        value: '1-50'
    },
    {
        name: 'R$ 51,00 a R$ 200,00',
        value: '51-200'
    },
    {
        name: 'R$ 201,00 a R$ 1000,00',
        value: '201-1000'
    },
];

const ratings = [
    {
        name: '4 estrelas ou mais',
        rating: 4,
    },
    {
        name: '3 estrelas ou mais',
        rating: 3,
    },
    {
        name: '2 estrelas ou mais',
        rating: 2,
    },
    {
        name: '1 estrelas ou mais',
        rating: 1,
    },
]

export default function SearchScreen() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const dispatch = useDispatch();
    const { error, loading, products, pages, countProducts } = useSelector(selectSearch)

    const sp = new URLSearchParams(search);
    const category = sp.get('category') || 'all';
    const query = sp.get('query') || 'all';
    const price = sp.get('price') || 'all';
    const rating = sp.get('rating') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1;

    useEffect(() => {
        const fetchData = async () => {
            dispatch(fetchRequest());
            try {
                const { data } = await axios.get(
                    `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
                )
                dispatch(fetchSuccess(data))
            } catch (err) {
                dispatch(fetchFail(getError(err)));
                toast.error(getError(err));
            }
        }
        fetchData();
    }, [page, query, category, price, rating, order, error]);

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data);
            } catch (err) {
                toast.error(getError(err));
            }
        }
        fetchCategories();
    }, [dispatch]);

    const getFilterUrl = (filter, linkContainer) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterPrice = filter.price || price;
        const filterOrder = filter.order || order;

        const link = linkContainer
        ? `page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}`
        : `/search?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}`

        return link
    }

    return (
        <div>
            <Helmet>
                <title>Pesquisar Produtos</title>
            </Helmet>
            <Row>
                <Col md={3}>
                    <div>
                        <h4>Departamento</h4>
                        <ul>
                            <li>
                                <Link
                                    className={'all' === category ? 'fw-bold' : ''}
                                    to={getFilterUrl({ category: 'all' })}
                                >
                                    Todos
                                </Link>
                            </li>
                            {categories.map((c) => (
                                <li key={c.category}>
                                    <Link
                                        className={c.category === category ? 'fw-bold' : ''}
                                        to={getFilterUrl({ category: c.category })}
                                    >
                                        {c.category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4>Preço</h4>
                        <ul>
                            <li>
                                <Link
                                    className={'all' === price ? 'fw-bold' : ''}
                                    to={getFilterUrl({ price: 'all' })}
                                >
                                    Todos
                                </Link>
                            </li>
                            {prices.map((p) => (
                                <li key={p.value}>
                                    <Link
                                        className={p.value === price ? 'fw-bold' : ''}
                                        to={getFilterUrl({ price: p.value })}
                                    >
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4>Avaliações</h4>
                        <ul>
                            {ratings.map((r) => (
                                <li key={r.name}>
                                    <Link
                                        className={r.rating === rating ? 'fw-bold' : ''}
                                        to={getFilterUrl({ rating: r.rating })}
                                    >
                                        <Rating caption={' ou mais'} rating={r.rating} />
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to={getFilterUrl({ rating: 'all' })}
                                    className={rating === 'all' ? 'fw-bold' : ''}
                                >
                                    <Rating caption={' ou mais'} rating={0} />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col md={9}>
                    {loading ? (
                        <LoadingBox />
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <>
                            <Row className="justify-content-between mb-3">
                                <Col md={6}>
                                    <div>
                                        {countProducts === 0 ? "Sem" : countProducts} resultado{countProducts !== 1 && 's'}
                                        {query !== 'all' && " : " + query}
                                        {category !== 'all' && " : " + category}
                                        {price !== 'all' && " : preço R$ " + price}
                                        {rating !== 'all' && " : avaliação " + rating + ' ou mais'}
                                        {query !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all' ? (
                                            <Button
                                                variant='light'
                                                onClick={() => navigate('/search')}
                                            >
                                                <i className='fas fa-times-circle' />
                                            </Button>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col className='text-end'>
                                    Organizar por{' '}
                                    <select
                                        value={order}
                                        onChange={(e) => {
                                            navigate(getFilterUrl({ order: e.target.value }))
                                        }}
                                    >
                                        <option value='newest'>Produtos novos</option>
                                        <option value='lowest'>Preço: Menor para o maior</option>
                                        <option value='highest'>Preço: Maior para o menor</option>
                                        <option value='toprated'>Bem avaliados</option>
                                    </select>
                                </Col>
                            </Row>
                            {products.length === 0 && (
                                <MessageBox>Produto não encontrado</MessageBox>
                            )}
                            <Row>
                                {products.map((product) => (
                                    <Col sm={6} lg={4} className="mb-3" key={product.id}>
                                        <Product product={product} />
                                    </Col>
                                ))}
                            </Row>

                            <div>
                                {[...Array(pages).keys()].map((x) => (
                                    <LinkContainer
                                        key={x + 1}
                                        className="mx-1"
                                        to={{
                                            search: getFilterUrl({ page: x + 1 }, true)
                                        }}
                                    >
                                        <Button
                                            className={Number(page) === x + 1 ? 'fw-bold' : ''}
                                            variant="light"
                                        >
                                            {x + 1}
                                        </Button>
                                    </LinkContainer>
                                ))}
                            </div>

                        </>
                    )}
                </Col>
            </Row>
        </div>
    )
}
