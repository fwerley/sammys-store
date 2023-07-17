import './featured.scss';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { CircularProgressbar } from 'react-circular-progressbar';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import "react-circular-progressbar/dist/styles.css"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchFail, fetchRequest, fetchSalesLastMonth, fetchSalesLastWeek, fetchSalesToday, selectDashboard } from '../../../slice/dashboardSlice';
import { formatCoin, getError } from '../../../utils';
import { selectUser } from '../../../slice/userSlice';
import LoadingBox from '../../../components/LoadingBox';

export default function Featured() {
    const dispatch = useDispatch();
    const [target, setTarget] = useState(2750)
    const { userInfo } = useSelector(selectUser);
    const { summary, sales, loading } = useSelector(selectDashboard);
    useEffect(() => {
        const fetchDataToday = async () => {
            dispatch(fetchRequest())
            try {
                const { data } = await axios.get('/api/dashboard/sales-today')
                dispatch(fetchSalesToday(data.amount))
            } catch (err) {
                dispatch(fetchFail(getError(err)));
            }
        }
        const fetchDataLastWeek = async () => {
            dispatch(fetchRequest())
            try {
                const { data } = await axios.get('/api/dashboard/sales-last-week')
                dispatch(fetchSalesLastWeek(data.amount))
            } catch (err) {
                dispatch(fetchFail(getError(err)));
            }
        }
        const fetchDataLastMonth = async () => {
            dispatch(fetchRequest())
            try {
                const { data } = await axios.get('/api/dashboard/sales-last-month')
                dispatch(fetchSalesLastMonth(data.amount))
            } catch (err) {
                dispatch(fetchFail(getError(err)));
            }
        }
        fetchDataToday()
        fetchDataLastWeek()
        fetchDataLastMonth()
    }, [userInfo, dispatch])
    return (
        <div className='featured'>
            <div className="top">
                <h1 className="title">Rendimento total</h1>
                <MoreVertOutlinedIcon fontSize='small' />
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar
                        value={sales.salesToday ? (sales.salesToday / target).toFixed(2) * 100 : 0}
                        text={`${sales.salesToday ? (sales.salesToday / target).toFixed(2) * 100 : 0}%`}
                        strokeWidth={5}
                    />
                </div>
                <p className="title">Vendas de hoje</p>
                <p className="amount">{
                    loading ? (<LoadingBox />) :
                        sales.salesToday ? formatCoin(sales.salesToday) : formatCoin(0)
                }</p>
                <p className="desc">
                    Processamento de transações anteriores.
                    Os últimos pagamentos podem não estar incluídos
                </p>
                <div className="summary">
                    <div className="item">
                        <div className="itemTitle">Objetivo</div>
                        <div className={`itemResult ${sales.salesToday > target ? 'positive' : 'negative'}`}>
                            <KeyboardArrowDownOutlinedIcon fontSize='small' />
                            <div className="resultAmount">{
                                sales.salesToday ? formatCoin(sales.salesToday - target) : formatCoin(target - sales.salesToday)}</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Ultima semana</div>
                        <div className="itemResult positive">
                            <KeyboardArrowUpOutlinedIcon fontSize='small' />
                            <div className="resultAmount">{loading ? (<LoadingBox />) : formatCoin(sales.salesLastWeek || 0)}</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Ultimo mês</div>
                        <div className="itemResult positive">
                            <KeyboardArrowUpOutlinedIcon fontSize='small' />
                            <div className="resultAmount">{formatCoin(loading ? (<LoadingBox />) : sales.salesLastMonth)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
