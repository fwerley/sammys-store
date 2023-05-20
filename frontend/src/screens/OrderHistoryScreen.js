import axios from 'axios'
import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import HelmetSEO from '../components/HelmetSEO'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { createRequest, fetchFail, fetchOrdersSuccess, selectOrder } from '../slice/orderSlice'
import { selectUser } from '../slice/userSlice'
import { formatCoin, formatedDate, getError } from '../utils'

export default function OrderHistoryScreen() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector(selectUser);
    const { loading, error, orders } = useSelector(selectOrder);

    useEffect(() => {
        const fetchData = async () => {
            dispatch(createRequest());
            try {
                const { data } = await axios.get(
                    `/api/orders/mine`,
                    { headers: { authorization: `Bearer ${userInfo.token}` } }
                );
                dispatch(fetchOrdersSuccess(data));
            } catch (error) {
                dispatch(fetchFail(getError(error)))
                toast.error(getError(error));
            }
        };
        fetchData();
    }, [dispatch, userInfo])
    return (
        <div>
            <HelmetSEO
                title="Meus pedidos"
                description='Todos os meus pedidos de compra'
                type='store'
            />
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
                                <td>{formatCoin(order.orderPrice.totalPrice.toFixed(2))}</td>
                                <td>{order.isPaid ? formatedDate(order.orderPrice.updatedAt) : 'Não'}</td>
                                <td>
                                    {order.isDelivered
                                        ? 'Sim'
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
