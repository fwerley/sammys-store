import { useSelector } from 'react-redux';
import './chart.scss'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { selectDashboard } from '../../../slice/dashboardSlice';
import { formatedDate } from '../../../utils';

// const data = [
//     { name: "Janeiro", Total: 1200 },
//     { name: "Fevereiro", Total: 2100 },
//     { name: "Março", Total: 800 },
//     { name: "Abril", Total: 1600 },
//     { name: "Maio", Total: 900 },
//     { name: "Junho", Total: 1700 },
// ];

export default function Chart({ aspect, title, data }) {
    
    return (
        <div className='chart'>
            <div className="title">{title}</div>
            <ResponsiveContainer width="100%" aspect={aspect}>
                <AreaChart width={730} height={250} data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2dd7c3" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#2dd7c3" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="aprovado" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="green" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke='gray' />
                    <CartesianGrid strokeDasharray="3 3" className='chartGrid' />
                    <Tooltip />
                    <Area type="monotone" dataKey="Total" stroke="#2dd7c3" fillOpacity={1} fill="url(#total)" />
                    <Area type="monotone" dataKey="Faturado" stroke="green" fillOpacity={1} fill="url(#aprovado)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
