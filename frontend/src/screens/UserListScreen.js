import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFail, deleteUserRequest, deleteUserReset, deleteUserSuccess, fetchUsers, fetchUsersFail, fetchUsersSuccess, selectUser } from '../slice/userSlice';
import axios from 'axios';
import { getError } from '../utils';
import HelmetSEO from '../components/HelmetSEO';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function UserListScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading, error, userInfo, loadingDelete, successDelete } = useSelector(selectUser);
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchUsers());
                const { data } = await axios.get('/api/users', {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                dispatch(fetchUsersSuccess(data))
            } catch (err) {
                dispatch(fetchUsersFail(getError(err)))
            }
        }
        if (successDelete) {
            dispatch(deleteUserReset());
        } else {
            fetchData()
        }
    }, [userInfo, successDelete, dispatch]);

    const deleteHandler = async (idUser) => {
        if (window.confirm('Deseja realmente delete este usuário?')) {
            try {
                dispatch(deleteUserRequest());
                await axios.delete(`/api/users/${idUser}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                toast.success('Usuário deletado com sucesso')
                dispatch(deleteUserSuccess())
            } catch (err) {
                dispatch(deleteUserFail());
                toast.error(getError(err));
            }
        }
    }

    return (
        <div>
            <HelmetSEO
                title="Usuarios"
                description="Listagem de usuários cadastrados"
            />
            <h1>Usuários</h1>
            {loadingDelete && <LoadingBox />}
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
                                <td>{user.isSeller ? 'SIM' : 'NÃO'}</td>
                                <td>{user.isAdmin ? 'SIM' : 'NÃO'}</td>
                                <td>
                                    <Button
                                        type='button'
                                        variant='light'
                                        onClick={() => navigate(`/admin/user/${user.id}`)}
                                    >
                                        Editar
                                    </Button>
                                    &nbsp;
                                    <Button
                                        type='button'
                                        variant='light'
                                        onClick={() => deleteHandler(user.id)}
                                    >
                                        Deletar
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
