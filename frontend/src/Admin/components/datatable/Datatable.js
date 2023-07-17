import './datatable.scss';
import { DataGrid } from '@mui/x-data-grid';

import { userColumns, userRows } from '../../datatablesource'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserFail, deleteUserRequest, deleteUserReset, deleteUserSuccess, fetchUsers, fetchUsersFail, fetchUsersSuccess, selectUser } from '../../../slice/userSlice';
import axios from 'axios';
import { getError } from '../../../utils';
import { toast } from 'react-toastify';

export default function Datatable() {
    const { users, loading, error, userInfo, loadingDelete, successDelete } = useSelector(selectUser);
    const [data, setData] = useState(userRows);
    const dispatch = useDispatch();
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

    const handleDelete = async (id) => {
        if (window.confirm('Deseja realmente delete este usuário?')) {
            try {
                dispatch(deleteUserRequest());
                await axios.delete(`/api/users/${id}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` }
                })
                toast.success('Usuário deletado com sucesso')
                dispatch(deleteUserSuccess())
            } catch (err) {
                dispatch(deleteUserFail());
                toast.error(getError(err));
            }
        }
        // setData(data.filter(item => item.id !== id))
    }
    const actionColumn = [
        {
            field: "action",
            headerName: "Ação",
            width: 200,
            renderCell: (param) => (
                <div className="cellAction">
                    <Link to={`./${param.row.id}`}>
                        <div className="viewButton">Visulaizar</div>
                    </Link>
                    <div className="deleteButton" onClick={() => handleDelete(param.row.id)}>Deletar</div>
                </div>
            )
        }
    ]

    return (
        <div className='datatable'>
            <div className="datatableTitle">
                Adicionar cliente
                <Link to="./new" className='link'>
                    Adicionar
                </Link>
            </div>
            <DataGrid
                className='datagrid'
                rows={users}
                columns={userColumns.concat(actionColumn)}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    )
}
