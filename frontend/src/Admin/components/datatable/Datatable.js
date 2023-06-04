import './datatable.scss';
import { DataGrid } from '@mui/x-data-grid';

import { userColumns, userRows } from '../../datatablesource'
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Datatable() {
    const [data, setData] = useState(userRows);
    const handleDelete = (id) => {
        setData(data.filter(item => item.id !== id))
    }
    const actionColumn = [
        {
            field: "action",
            headerName: "Ação",
            width: 200,
            renderCell: (param) => (
                <div className="cellAction">
                    <Link to="./2324544">
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
                rows={data}
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
