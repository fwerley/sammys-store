import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { fetchFailure, fetchListProductsSuccess, fetchRequest, selectProducts } from '../slice/productsSlice'
import { selectUser } from '../slice/userSlice';
import { getError } from '../utils';

export default function ProductListScreen() {
    const { search, pathname } = useLocation();
    const sp = new URLSearchParams(search);
    const page = sp.get('page') || 1;
    const { products, loading, error, pages } = useSelector(selectProducts);
    const { userInfo } = useSelector(selectUser)
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            dispatch(fetchRequest())
            try {
                const { data } = await axios.get(`/api/products/admin?page=${page}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                dispatch(fetchListProductsSuccess(data))
            } catch (error) {
                toast.error(getError(error))
                dispatch(fetchFailure(getError(error)))
            }
        }
        fetchData();
    }, [page, userInfo]);
    return (
        <div>
            <h1>Produtos</h1>
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
