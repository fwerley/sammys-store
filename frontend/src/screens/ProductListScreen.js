import axios from 'axios';
import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchFailure, fetchListProductsSuccess, fetchRequest, selectProducts } from '../slice/productsSlice'
import { selectUser } from '../slice/userSlice';
import { getError } from '../utils';
import { createSuccessProduct, deleteFailureProduct, deleteRequestProduct, deleteResetProduct, deleteSuccessProduct, fetchFailureProduct, fetchRequestProduct, selectProduct } from '../slice/productSlice';

export default function ProductListScreen() {
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;
    const { products, loading, error, pages } = useSelector(selectProducts);
    const { loadingDelete, successDelete } = useSelector(selectProduct);
    const { userInfo } = useSelector(selectUser)
    const dispatch = useDispatch();
    const sellerMode = pathname.indexOf('/seller') === 0;
    useEffect(() => {
        const queryFilter = sellerMode ? `&seller=${userInfo.seller && userInfo.seller.id}` : ''
        const fetchData = async () => {
            dispatch(fetchRequest())
            try {
                const { data } = await axios.get(`/api/products/admin?page=${page}${queryFilter}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                dispatch(fetchListProductsSuccess(data))
            } catch (error) {
                toast.error(getError(error))
                dispatch(fetchFailure(getError(error)))
            }
        }
        if (successDelete) {
            dispatch(deleteResetProduct());
        } else {
            fetchData();
        }
    }, [page, userInfo, successDelete, dispatch, sellerMode]);

    const createHandler = async () => {
        if (window.confirm('Deseja criar um novo produto')) {
            try {
                dispatch(fetchRequestProduct());
                const { data } = await axios.post(`/api/products`,
                    {}, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                toast.success('Produto criado com seucesso');
                dispatch(createSuccessProduct(data));
                navigate(`/admin/product/${data.product.id}`);
            } catch (error) {
                toast.error(getError(error))
                dispatch(fetchFailureProduct(getError(error)));
            }
        }
    }

    const deleteHandler = async (idProduct) => {
        if (window.confirm('Deseja deletar este produto?')) {
            try {
                dispatch(deleteRequestProduct())
                await axios.delete(`/api/products/${idProduct}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                });
                toast.success('Produto deletado com sucesso');
                dispatch(deleteSuccessProduct());
            } catch (error) {
                toast.error(getError(error));
                dispatch(deleteFailureProduct(getError(error)))
            }
        }
    }

    return (
        <div>
            <Helmet>
                <title>Produtos</title>
            </Helmet>
            <Row>
                <Col><h1>Produtos</h1></Col>
                <Col className='col text-end'>
                    <Button type="button" onClick={createHandler}>
                        Criar Produto
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <LoadingBox />}

            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NOME</th>
                                <th>PREÇO</th>
                                <th>CATEGORIA</th>
                                <th>MARCA</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((produc) => (
                                <tr key={produc.id}>
                                    <td>{produc.id}</td>
                                    <td>{produc.name}</td>
                                    <td>R$ {produc.price}</td>
                                    <td>{produc.category}</td>
                                    <td>{produc.brand}</td>
                                    <td>
                                        <Button
                                            type='button'
                                            variant='light'
                                            onClick={() => navigate(`/admin/product/${produc.id}`)}
                                        >
                                            Editar
                                        </Button>&nbsp;
                                        <Button
                                            type='button'
                                            variant='light'
                                            onClick={() => deleteHandler(produc.id)}
                                        >
                                            Deletar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(page) ? 'btn fw-bold' : 'btn'}
                                key={x + 1}
                                to={`/admin/products?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
