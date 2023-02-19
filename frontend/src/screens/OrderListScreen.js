import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

import { createRequest, deleteFail, deleteRequest, deleteReset, deleteSuccess, fetchFail, fetchOrdersSuccess, selectOrder } from '../slice/orderSlice';
import { selectUser } from '../slice/userSlice';
import { formatedDate, getError } from '../utils';
import HelmetSEO from '../components/HelmetSEO';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';


export default function OrderListScreen() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector(selectUser);
    const { orders, loading, error, loadingDelete, successDelete, errorDelete } = useSelector(selectOrder);

    const deleteHandler = async (orderId) => {
        if (window.confirm('Deseja realemtne deletar este pedido?')) {
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
        const fetchData = async () => {
            try {
                dispatch(createRequest());
                const { data } = await axios.get(`/api/orders`,
                    { headers: { authorization: `Bearer ${userInfo.token}` } })
                dispatch(fetchOrdersSuccess(data));
            } catch (error) {
                dispatch(fetchFail(getError(error)));
                toast.error(getError(error));
            }
        }
        if (successDelete) {
            dispatch(deleteReset())
        } {
            fetchData();
        }
    }, [userInfo, successDelete]);

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
                            <th>USUÁRIO</th>
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
                                <td>R$ {order.orderPrice.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? formatedDate(order.orderPrice.updatedAt) : 'Não'}</td>
                                <td>
                                    {order.isDelivered
                                        ? formatedDate(order.deliveredAt)
                                        : 'Não'}
                                </td>
                                <td>
                                    <Button
                                        type='button'
                                        variant='light'
                                        onClick={() => {
                                            navigate(`/order/${order.id}`)
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
