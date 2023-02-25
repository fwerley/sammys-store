import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchUsersFail, fetchUsersSuccess, selectUser } from '../slice/userSlice';
import axios from 'axios';
import { getError } from '../utils';
import HelmetSEO from '../components/HelmetSEO';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function UserListScreen() {
    const dispatch = useDispatch()
    const { users, loading, error, userInfo } = useSelector(selectUser);
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchUsers());
                const { data } = await axios.get('/api/users', {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                console.log(data)
                dispatch(fetchUsersSuccess(data))
            } catch (err) {
                dispatch(fetchUsersFail(getError(err)))
            }
        }
        fetchData()
    }, [userInfo]);

    return (
        <div>
            <HelmetSEO
                title="Usuarios"
                description="Listagem de usuários cadastrados"
            />
            <h1>Usuários</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOME</th>
                            <th>EMAIL</th>
                            <th>VENDEDOR</th>
                            <th>ADMIN</th>
                            <th>AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'SIM' : 'NÃO'}</td>
                                <td>{user.isAdmin ? 'SIM' : 'NÃO'}</td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
