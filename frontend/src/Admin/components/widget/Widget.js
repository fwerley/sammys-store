import './widget.scss';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useSelector } from 'react-redux';

import { selectDashboard } from '../../../slice/dashboardSlice';
import { Link } from 'react-router-dom';
import { formatCoin } from '../../../utils';

export default function Widget({ type }) {

    const { loading, summary, error } = useSelector(selectDashboard);
    let data
    // temporario
    const amount = 100;
    const diff = 20;    

    switch (type) {
        case "user":
            data = {
                title: "USUÁRIOS",
                isMoney: false,
                amount:
                    summary.users && summary.users._count
                        ? summary.users._count
                        : 0,
                link: (<Link to={'users'}>Lista de usuários</Link>),
                icon: (
                    <PersonOutlineOutlinedIcon
                        className='icon'
                        style={{
                            color: "crimson",
                            backgroundColor: "rgba(255,0,0,0.2)"
                        }}
                    />
                )
            }
            break;
        case "order":
            data = {
                title: "PEDIDOS",
                isMoney: false,
                amount:
                    summary.orders && summary.orders._count
                        ? summary.orders._count
                        : 0,
                link: (<Link to={'orders'}>Lista de pedidos</Link>),
                icon: (
                    <ShoppingCartOutlinedIcon
                        className='icon'
                        style={{
                            color: "goldenrod",
                            backgroundColor: "rgba(218,165, 32,0.2)"
                        }}
                    />
                )
            }
            break;
        case "earning":
            data = {
                title: "FATURAMENTO",
                isMoney: true,
                // amount: formatCoin(summary.ordersApproved._sum.totalPrice),
                link: "Detalhamento",
                icon: (
                    <MonetizationOnOutlinedIcon
                        className='icon'
                        style={{
                            color: "green",
                            backgroundColor: "rgba(0,128,0,0.2)"
                        }}
                    />
                )
            }
            break;
        case "balance":
            data = {
                title: "BALANÇO",
                isMoney: false,
                link: "Detalhamento",
                icon: (
                    <AccountBalanceWalletOutlinedIcon
                        className='icon'
                        style={{
                            color: "purple",
                            backgroundColor: "rgba(128,0,128,0.2)"
                        }}
                    />
                )
            }
            break;
        default:
            break;
    }

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{data.amount}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">
                <div className="percentage positive">
                    <KeyboardArrowUpOutlinedIcon />
                    {diff}%
                </div>
                {data.icon}
            </div>
        </div>
    )
}
