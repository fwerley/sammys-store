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

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className="top">
                <span className="logo">
                    Sammy Admin
                </span>
            </div>
            <hr />
            <div className="center">
                <ul>
                    <p className="title">PRINCIPAL</p>
                    <li>
                        <DashboardIcon className="icon" />
                        <span>Dashboad</span>
                    </li>
                    <p className="title">LISTAS</p>
                    <li>
                        <PersonOutlineOutlinedIcon className="icon" />
                        <span>Usuarios</span>
                    </li>
                    <li>
                        <StoreOutlinedIcon className="icon" />
                        <span>Produtos</span>
                    </li>
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
                    <li>
                        <LogoutOutlinedIcon className="icon" />
                        <span>Sair</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div>
        </div>
    )
}
