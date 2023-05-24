import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'

export default function AppAdmin() {
    return (
        <div className='AppAdmin'>
            <Routes>
                <Route path="/" >
                    <Route index element={<Home />} />
                    {/* <Route path="*" element={<Navigate to="/" replace/>} /> */}
                    <Route path="users" element={<View />} >
                        <Route index element={<View />} />
                        <Route path=':id' element={<View />} />
                        <Route path='new' element={<View />} />
                    </Route>

                </Route>
            </Routes>
        </div>
    )
}

export function View() {

    return (
        <div>Oi</div>
    )
}
