import { Route, Routes } from 'react-router-dom'
import Chart from '../../components/Chart/Chart'
import Featured from '../../components/featured/Featured'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Table from '../../components/table/Table'
import Widget from '../../components/widget/Widget'

import './home.scss';
import '../../style/dark.scss';

import List from '../list/List'
import Single from '../single/Single'
import New from '../new/New'
import { productInputs, userInputs } from '../../formSource'
import { useContext } from 'react'
import { DarkModeContext } from '../../context/darkModeContext'

export default function Home() {

    const { darkMode } = useContext(DarkModeContext)

    return (
        <div className={darkMode ? "home dark" : "home"}>
            <Sidebar />
            <div className="homeContainer">
                <Navbar />

                <Routes>
                    <Route path="/">
                        <Route index element={<DashboardView />} />
                        <Route path="users">
                            <Route index element={<List />} />
                            <Route path=":userId" element={<Single />} />
                            <Route path="new" element={<New title="Adicionar cliente" inputs={userInputs} />} />
                        </Route>
                        <Route path="products">
                            <Route index element={<List />} />
                            <Route path=":productId" element={<Single />} />
                            <Route path="new" element={<New title="Adicionar produto" inputs={productInputs} />} />
                        </Route>
                    </Route>
                </Routes>
            </div>
        </div>
    )
}

function DashboardView() {
    return (
        <>
            <div className="widgets">
                <Widget type="user" />
                <Widget type="order" />
                <Widget type="earning" />
                <Widget type="balance" />
            </div>
            <div className="charts">
                <Featured />
                <Chart aspect={2 / 1} title="Ultimos 6 meses (receita)" />
            </div>
            <div className="listContainer">
                <div className="listTitle">Ultimas transações</div>
                <Table />
            </div>
        </>
    )
}
