import './navbar.scss'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import FullscreenExitOutlined from '@mui/icons-material/FullscreenExitOutlined';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import ChatBubbleOutlineOutlined from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ListOutlined from '@mui/icons-material/ListOutlined';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';

export default function Navbar() {

    const { dispatch } = useContext(DarkModeContext)

    return (
        <div className='navbar'>
            <div className="wrapper">
                <div className="search">
                    <input type="text" placeholder="Pesquisar..." />
                    <SearchOutlinedIcon />
                </div>
                <div className="items">
                    <div className="item">
                        <LanguageOutlined className="icon" />
                        Inglês
                    </div>
                    <div className="item" onClick={() => dispatch({ type: "TOGGLE" })}>
                        <DarkModeOutlined className="icon" />
                    </div>
                    <div className="item">
                        <FullscreenExitOutlined className="icon" />
                    </div>
                    <div className="item">
                        <NotificationsNoneOutlined className="icon" />
                        <div className="counter">1</div>
                    </div>
                    <div className="item">
                        <ChatBubbleOutlineOutlined className="icon" />
                        <div className="counter">2</div>
                    </div>
                    <div className="item">
                        <ListOutlined className="icon" />
                    </div>
                    <div className="item">
                        <img
                            src="https://lh3.googleusercontent.com/ogw/AOLn63HDKQ-GNWozQ--gvrI7B2zp20OZ09ESpoBV4zT4=s32-c-mo"
                            alt=""
                            className="avatar"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
