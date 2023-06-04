import './widget.scss';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

export default function Widget({ type }) {
    let data
    // temporario
    const amount = 100;
    const diff = 20;

    switch (type) {
        case "user":
            data = {
                title: "USUÁRIOS",
                isMoney: false,
                link: "Lista de usuários",
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
                link: "Lista de pedidos",
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
                <span className="counter">{data.isMoney && "R$"} {amount}</span>
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
