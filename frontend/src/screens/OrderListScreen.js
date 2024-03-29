import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

import { createRequest, deleteFail, deleteRequest, deleteReset, deleteSuccess, fetchFail, fetchOrdersSuccess, selectOrder } from '../slice/orderSlice';
import { selectUser } from '../slice/userSlice';
import { formatCoin, formatedDate, getError } from '../utils';
import HelmetSEO from '../components/HelmetSEO';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';


export default function OrderListScreen() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const sellerMode = pathname.indexOf('/seller') === 0;
    const { userInfo } = useSelector(selectUser);
    const { orders, loading, error, loadingDelete, successDelete } = useSelector(selectOrder);

    const deleteHandler = async (orderId) => {
        if (window.confirm('Deseja realmente deletar este pedido?')) {
            try {
                dispatch(deleteRequest())
                await axios.delete(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                toast.success('Pedido deletado com sucesso')
                dispatch(deleteSuccess());
            } catch (error) {
                dispatch(deleteFail(getError(error)))
                toast.error(getError(error));
            }
        }
    }

    useEffect(() => {
        const queryFilter = sellerMode ? `?seller=${userInfo.seller && userInfo.seller.id}` : ''
        const fetchData = async () => {
            try {
                dispatch(createRequest());
                const { data } = await axios.get(`/api/orders${queryFilter}`,
                    { headers: { authorization: `Bearer ${userInfo.token}` } })
                dispatch(fetchOrdersSuccess(data));
            } catch (error) {
                dispatch(fetchFail(getError(error)));
                toast.error(getError(error));
            }
        }
        if (successDelete) {
            dispatch(deleteReset())
        } else {
            fetchData();
        }
    }, [userInfo, dispatch, sellerMode, successDelete]);

    return (
        <div>
            <HelmetSEO
                title='Pedidos'
                description='Relação de todos os pedidos de compra'
                type='summary'
            />
            <h1>Pedidos</h1>
            {loadingDelete && <LoadingBox />}
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox>{error}</MessageBox>
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CLIENTE</th>
                            <th>DATA</th>
                            <th>TOTAL</th>
                            <th>PAGO</th>
                            <th>ENVIADO</th>
                            <th>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user ? order.user.name : 'Usuário deletado'}</td>
                                <td>{formatedDate(order.createdAt)}</td>
                                <td>{formatCoin(order.orderPrice.totalPrice.toFixed(2))}</td>
                                <td>{order.isPaid ? formatedDate(order.transaction.paidAt) :
                                    <span className='text-danger'>Não</span>}
                                </td>
                                <td>
                                    {order.isDelivered
                                        ? <span className='text-success'>Sim</span>
                                        : <span className='text-danger'>Não</span>}
                                </td>
                                <td>
                                    <Button
                                        type='button'
                                        variant='light'
                                        onClick={() => {
                                            navigate((sellerMode ? '/seller' : '') + `/order/${order.id}`)
                                        }}
                                    >
                                        Detalhes
                                    </Button>&nbsp;
                                    <Button
                                        type='button'
                                        variant='light'
                                        onClick={() => deleteHandler(order.id)}
                                    >
                                        Deletar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
