import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import axios from 'axios';

import Chart from 'react-google-charts';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { fetchFail, fetchRequest, fetchSuccess, selectDashboard } from '../slice/dashboardSlice';
import { selectUser } from '../slice/userSlice';
import { formatedDate, getError } from '../utils';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';

export default function DashboardScreen() {

  const dispatch = useDispatch();
  const { userInfo } = useSelector(selectUser);
  const { loading, summary, error } = useSelector(selectDashboard);

  const options = {
    title: "Vendas diárias",
    hAxis: { title: "Dia", titleTextStyle: { color: "#333" } },
    vAxis: { title: 'R$', minValue: 0 },
    // chartArea: { width: "50%", height: "70%" },
  };

  const optionsProducts = {
    title: "Produtos por categoria",
    // pieHole: 0.4,
    is3D: false,
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchRequest())
      try {
        const { data } = await axios.get('/api/orders/summary', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        })
        dispatch(fetchSuccess(data))
      } catch (err) {
        dispatch(fetchFail(getError(err)));
        toast.error(getError(err))
      }
    }
    fetchData()
  }, [userInfo])

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (<LoadingBox />)
        : error ? (<MessageBox variant='danger'>{error}</MessageBox>)
          : (
            <>
              <Row>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.users && summary.users._count
                          ? summary.users._count
                          : 0}
                      </Card.Title>
                      <Card.Text>Usuários</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.orders && summary.orders._count
                          ? summary.orders._count
                          : 0}
                      </Card.Title>
                      <Card.Text>Pedidos</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        R$ {summary.users && summary.orders._sum.totalPrice
                          ? summary.orders._sum.totalPrice.toFixed(2)
                          : 0}
                      </Card.Title>
                      <Card.Text>Pedidos</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <div className='my-3'>
                <h2>Vendas</h2>
                {!summary.dailyOrders ? (
                  <MessageBox>Sem vendas</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType='AreaChart'
                    loader={<div>Carregando gráfico...</div>}
                    data={[
                      ['Data', 'Vendas'],
                      ...summary.dailyOrders.map((x) => [formatedDate(x.createdAt), x._sum.totalPrice]),
                    ]}
                    options={options}
                  ></Chart>
                )}
              </div>
              <div className='my-3'>
                <h2>Categorias</h2>
                {!summary.productCategories ? (
                  <MessageBox>Sem categorias</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType='PieChart'
                    loader={<div>Carregando gráfico...</div>}
                    data={[
                      ['Categoria', 'Produtos'],
                      ...summary.productCategories.map((x) => [x.category, x._count]),
                    ]}
                    options={optionsProducts}
                  ></Chart>
                )}
              </div>
            </>
          )}
    </div>
  )
}
