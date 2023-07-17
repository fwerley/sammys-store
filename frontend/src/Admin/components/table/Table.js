import './table.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { selectDashboard } from '../../../slice/dashboardSlice';
import LoadingBox from '../../../components/LoadingBox';
import { formatCoin, formatedDate, translatePaymentMethod } from '../../../utils';

export default function List({ data }) {

    const rows = [
        {
            id: 1143155,
            product: "Acer Nitro 5",
            img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
            customer: "John Smith",
            date: "1 March",
            amount: 785,
            method: "Cash on Delivery",
            status: "Approved",
        },
        {
            id: 2235235,
            product: "Playstation 5",
            img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
            customer: "Michael Doe",
            date: "1 March",
            amount: 900,
            method: "Online Payment",
            status: "Pending",
        },
        {
            id: 2342353,
            product: "Redragon S101",
            img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
            customer: "John Smith",
            date: "1 March",
            amount: 35,
            method: "Cash on Delivery",
            status: "Pending",
        },
        {
            id: 2357741,
            product: "Razer Blade 15",
            img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
            customer: "Jane Smith",
            date: "1 March",
            amount: 920,
            method: "Online",
            status: "Approved",
        },
        {
            id: 2342355,
            product: "ASUS ROG Strix",
            img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
            customer: "Harold Carol",
            date: "1 March",
            amount: 2000,
            method: "Online",
            status: "Pending",
        },
    ];
    const { loadingTransaction } = useSelector(selectDashboard);
    return (

        <TableContainer component={Paper} className='table'>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className="tableCell">Tracking ID</TableCell>
                        <TableCell className="tableCell">Produto</TableCell>
                        <TableCell className="tableCell">Cliente</TableCell>
                        <TableCell className="tableCell">Data</TableCell>
                        <TableCell className="tableCell">Valor</TableCell>
                        <TableCell className="tableCell">Pagamento</TableCell>
                        <TableCell className="tableCell">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loadingTransaction ? <LoadingBox /> :
                        data.map((row) => (
                            <TableRow
                                key={row.id}
                            >
                                <TableCell component="th" scope="row" className="tableCell">
                                    {row.id}
                                </TableCell>
                                <TableCell className="tableCell">
                                    <div className="cellWrapper">
                                        <img src={row.orderItems[0].product.image} alt="" className="image" />
                                        {row.product}
                                    </div>
                                </TableCell>
                                <TableCell className="tableCell">{row.user.name}</TableCell>
                                <TableCell className="tableCell">{formatedDate(row.createdAt)}</TableCell>
                                <TableCell className="tableCell">{formatCoin(row.orderPrice.totalPrice)}</TableCell>
                                <TableCell className="tableCell">{translatePaymentMethod(row.paymentMethod)}</TableCell>
                                <TableCell className="tableCell">
                                    <span className={`status ${row.isPaid ? 'Approved' : 'Pending'}`}>{row.isPaid ? 'Aprovado' : 'Pendente'}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
