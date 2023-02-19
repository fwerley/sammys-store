import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

import { createRequest, fetchFail, fetchOrdersSuccess, selectOrder } from '../slice/orderSlice';
import { selectUser } from '../slice/userSlice';
import { formatedDate, getError } from '../utils';
import HelmetSEO from '../components/HelmetSEO';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function OrderListScreen() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userInfo } = useSelector(selectUser);
    const { orders, loading, error } = useSelector(selectOrder);

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
        fetchData();
    }, [userInfo]);

    return (
        <div>
            <HelmetSEO
                title='Pedidos'
                description='Relação de todos os pedidos de compra'
                type='summary'
            />
            <h1>Pedidos</h1>
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
