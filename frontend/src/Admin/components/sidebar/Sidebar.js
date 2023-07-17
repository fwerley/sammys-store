import './sidebar.scss';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import LowPriorityOutlinedIcon from '@mui/icons-material/LowPriorityOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsSystemDaydreamOutlinedIcon from '@mui/icons-material/SettingsSystemDaydreamOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { Link } from 'react-router-dom';
import { DarkModeContext } from '../../context/darkModeContext';
import { useContext } from 'react';
import { userSignout } from '../../../slice/userSlice';
import { useDispatch } from 'react-redux';

export default function Sidebar() {

    const newDispatch = useDispatch()
    const { dispatch } = useContext(DarkModeContext);

    const signoutHandler = () => {
        newDispatch(userSignout());
        window.location.href = `${document.location.protocol}//${document.location.host.split(".")[1]}/signin`
      };

    return (
        <div className='sidebar'>
            <div className="top">
                <Link to="/">
                    <span className="logo">
                        Sammy Admin
                    </span>
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">PRINCIPAL</p>
                    <Link to="/">
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dashboad</span>
                        </li>
                    </Link>
                    <p className="title">LISTAS</p>
                    <Link to="/users">
                        <li>
                            <PersonOutlineOutlinedIcon className="icon" />
                            <span>Usuarios</span>
                        </li>
                    </Link>
                    <Link to="/products">
                        <li>
                            <StoreOutlinedIcon className="icon" />
                            <span>Produtos</span>
                        </li>
                    </Link>
                    <li>
                        <LowPriorityOutlinedIcon className="icon" />
                        <span>Pedidos</span>
                    </li>
                    <li>
                        <LocalShippingOutlinedIcon className="icon" />
                        <span>Envios</span>
                    </li>
                    <p className="title">UTILIDADES</p>
                    <li>
                        <PollOutlinedIcon className="icon" />
                        <span>Estatisticas</span>
                    </li>
                    <li>
                        <NotificationsNoneOutlinedIcon className="icon" />
                        <span>Notificações</span>
                    </li>
                    <p className="title">SERVIÇOS</p>
                    <li>
                        <SettingsSystemDaydreamOutlinedIcon className="icon" />
                        <span>Saúde do sistema</span>
                    </li>
                    <li>
                        <PsychologyOutlinedIcon className="icon" />
                        <span>Logs</span>
                    </li>
                    <li>
                        <SettingsOutlinedIcon className="icon" />
                        <span>Configurações</span>
                    </li>
                    <p className="title">USUARIO</p>
                    <li>
                        <AccountCircleOutlinedIcon className="icon" />
                        <span>Perfil</span>
                    </li>
                    <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                    >
                        <li>
                            <LogoutOutlinedIcon className="icon" />
                            <span>Sair</span>
                        </li>
                    </Link>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption" onClick={() => dispatch({ type: "LIGHT" })}></div>
                <div className="colorOption" onClick={() => dispatch({ type: "DARK" })}></div>
            </div>
        </div>
    )
}
