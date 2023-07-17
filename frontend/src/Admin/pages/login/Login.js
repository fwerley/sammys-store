import { useNavigate, useParams } from 'react-router-dom';
import './login.scss'
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userSignin } from '../../../slice/userSlice';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { token } = params;

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await axios.post(`/api/users/admin/signin`, { token }, {
                headers: { authorization: `Bearer ${token}` }
            })
            dispatch(userSignin(data));
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        }
        fetchUser();
    }, [token]);
    return (
        <div className='loginContainer'>
            <div id='spinner' className=''>
                <i className="fa-solid fa-spinner fa-spin"></i>
            </div>
        </div>
    )
}
