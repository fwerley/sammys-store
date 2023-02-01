import axios from 'axios'
import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { createRequest, fetchFail, fetchOrdersSuccess, selectOrder } from '../slice/orderSlice'
import { selectUser } from '../slice/userSlice'
import { formatedDate, getError } from '../utils'

export default function OrderHistoryScreen() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(selectUser);
    const { loading, error, orders } = useSelector(selectOrder);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(createRequest());
            console.log('data')
            try {
                const { data } = await axios.get(
                    `/api/orders/mine`,
                    { headers: { authorization: `Bearer ${userInfo.token}` } }
                );
                dispatch(fetchOrdersSuccess(data));             
            } catch (error) {
                dispatch(fetchFail(getError(error)))
                console.log('erroe')
            }
        };
        fetchData();
    }, [])
    return (
        <div>
            <Helmet>
                <title>Meus pedidos</title>
            </Helmet>
            <h1>Meus pedidos</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
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
                                <td>{formatedDate(order.createdAt)}</td>
                                <td>R$ {order.orderPrice.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? formatedDate(order.orderPrice.updatedAt) : 'Não'}</td>
                                <td>
                                    {order.isDelivered
                                        ? order.deliveredAt.substring(0, 10)
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
