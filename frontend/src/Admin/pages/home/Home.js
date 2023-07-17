import axios from 'axios'
import { useContext, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Chart from '../../components/Chart/Chart'
import Featured from '../../components/featured/Featured'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Table from '../../components/table/Table'
import Widget from '../../components/widget/Widget'

import './home.scss';
import '../../style/dark.scss';

import { fetchFail, fetchRequest, fetchRequestTransactions, fetchSuccess, fetchSuccessTransactions, selectDashboard } from '../../../slice/dashboardSlice'

import List from '../list/List'
import Single from '../single/Single'
import New from '../new/New'
import { productInputs, userInputs } from '../../formSource'
import { DarkModeContext } from '../../context/darkModeContext'
import { selectUser } from '../../../slice/userSlice'
import { arrayMonth, getError } from '../../../utils'
import { toast } from 'react-toastify'

export default function Home() {

    const dispatch = useDispatch();
    const { darkMode } = useContext(DarkModeContext);
    const { userInfo } = useSelector(selectUser);

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
    }, [userInfo, dispatch])

    return (
        <div className={darkMode ? "home dark" : "home"}>
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <Routes>
                    <Route path="/">
                        <Route index element={<DashboardView />} />
                        <Route path="users">
                            <Route index element={<List />} />
                            <Route path=":userId" element={<Single />} />
                            <Route path="new" element={<New title="Adicionar cliente" inputs={userInputs} />} />
                        </Route>
                        <Route path="products">
                            <Route index element={<List />} />
                            <Route path=":productId" element={<Single />} />
                            <Route path="new" element={<New title="Adicionar produto" inputs={productInputs} />} />
                        </Route>
                    </Route>
                </Routes>
            </div>
        </div>
    )
}

function DashboardView() {
    const dispatch = useDispatch();
    const { summary, transactions } = useSelector(selectDashboard);
    const data = summary && summary.monthOrders && summary.monthOrders.
        map((x) => ({
            "name": arrayMonth[x.createdAt],
            "Faturado": x._sum.totalPriceApproved,
            "Total": x._sum.totalPrice
        })).reverse();
    useEffect(() => {
        const fetchLastTransactions = async () => {
            dispatch(fetchRequestTransactions())
            try {
                const { data } = await axios.get('/api/dashboard/last-transactions')
                dispatch(fetchSuccessTransactions(data))
            } catch (err) {
                dispatch(fetchFail(getError(err)));
            }
        }
        fetchLastTransactions()
    }, [dispatch])
    return (
        <>
            <div className="widgets">
                <Widget type="user" />
                <Widget type="order" />
                <Widget type="earning" />
                <Widget type="balance" />
            </div>
            <div className="charts">
                <Featured />
                <Chart aspect={2 / 1} title="Ultimos 6 meses (receita)" data={data} />
            </div>
            <div className="listContainer">
                <div className="listTitle">Ultimas transações</div>
                <Table data={transactions} />
            </div>
        </>
    )
}
