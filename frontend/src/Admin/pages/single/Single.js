import Chart from '../../components/Chart/Chart';
import List from '../../components/table/Table';
import './single.scss';

export default function Single() {
    return (
        <div className="single">
            <div className="singleContainer">
                <div className="top">
                    <div className="left">
                        <div className="editButton">Editar</div>
                        <h1 className="title">Informações</h1>
                        <div className="item">
                            <img src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260" alt="avatar" className='itemImg' />
                            <div className="details">
                                <h1 className="itemTitle">Jane Doe</h1>
                                <div className="detailItem">
                                    <span className="itemKey">Email:</span>
                                    <span className="itemValue">janedoe@gmail.com</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Tel:</span>
                                    <span className="itemValue">88 891522160</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Endereço:</span>
                                    <span className="itemValue">Rua A, Centro, Três Lagoas - MS</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Pais:</span>
                                    <span className="itemValue">BR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <Chart aspect={3 / 1} title="Compras (ultimos 6 meses)" />
                    </div>
                </div>
                <div className="bottom">
                    <h1 className="title">Ultimas compras</h1>
                    <List />
                </div>
            </div>
        </div>
    )
}
