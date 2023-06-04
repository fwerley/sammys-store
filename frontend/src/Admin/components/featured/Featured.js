import './featured.scss';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { CircularProgressbar } from 'react-circular-progressbar';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import "react-circular-progressbar/dist/styles.css"

export default function Featured() {
    return (
        <div className='featured'>
            <div className="top">
                <h1 className="title">Rendimento total</h1>
                <MoreVertOutlinedIcon fontSize='small' />
            </div>
            <div className="bottom">
                <div className="featuredChart">
                    <CircularProgressbar value={70} text={"70%"} strokeWidth={5} />
                </div>
                <p className="title">Vendas de hoje</p>
                <p className="amount">R$ 420</p>
                <p className="desc">
                    Processamento de transações anteriores.
                    Os últimos pagamentos podem não estar incluídos
                </p>
                <div className="summary">
                    <div className="item">
                        <div className="itemTitle">Objetivo</div>
                        <div className="itemResult negative">
                            <KeyboardArrowDownOutlinedIcon fontSize='small' />
                            <div className="resultAmount">R$ 12.4k</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Ultima semana</div>
                        <div className="itemResult positive">
                            <KeyboardArrowUpOutlinedIcon fontSize='small' />
                            <div className="resultAmount">R$ 12.4k</div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="itemTitle">Ultimo mês</div>
                        <div className="itemResult positive">
                            <KeyboardArrowUpOutlinedIcon fontSize='small' />
                            <div className="resultAmount">R$ 12.4k</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
