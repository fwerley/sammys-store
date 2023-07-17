import { useDispatch, useSelector } from 'react-redux';
import Chart from '../../components/Chart/Chart';
import List from '../../components/table/Table';
import './single.scss';
import { selectUser, userFailure, userResquest, userResquestSuccess } from '../../../slice/userSlice';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getError } from '../../../utils';

export default function Single() {
    const params = useParams();
    const dispatch = useDispatch()
    const [user, setUser] = useState('')
    const { userInfo } = useSelector(selectUser);
    const { userId } = params;
    const { users } = useSelector(selectUser);
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(userResquest());
                const { data } = await axios.get(`/api/users/${userId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                dispatch(userResquestSuccess())
                setUser(data)
            } catch (err) {
                dispatch(userFailure(getError(err)))
            }
        }
        let user = users.filter(user => user.id === userId);
        if (user.length > 0) {
            setUser(user[0])
        } else {
            fetchData();
        }
    }, [userId])
    return (
        <div className="single">
            <div className="singleContainer">
                <div className="top">
                    <div className="left">
                        <div className="editButton">Editar</div>
                        <h1 className="title">Informações</h1>
                        <div className="item">
                            <img src={false || "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Images.png"} alt="avatar" className='itemImg' />
                            <div className="details">
                                <h2 className="itemTitle">{user.name}</h2>
                                <div className="detailItem">
                                    <span className="itemKey">Email:</span>
                                    <span className="itemValue">{user.email}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Tel:</span>
                                    <span className="itemValue">{user.mobile}</span>
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
