import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import { DarkModeContextProvider } from './context/darkModeContext'
import Login from './pages/login/Login'
import AdminRoute from '../components/AdminRoute'

export default function AppAdmin() {
    return (
        <DarkModeContextProvider>
            <div className='AppAdmin'>
                <Routes>
                    <Route path="/*"
                        element={
                            <AdminRoute>
                                <Home />
                            </AdminRoute>
                        }
                    />
                    <Route path='login/token/:token' element={<Login />} />
                </Routes>
            </div>
        </DarkModeContextProvider>
    )
}
