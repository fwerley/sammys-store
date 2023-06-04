import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import { DarkModeContextProvider } from './context/darkModeContext'

export default function AppAdmin() {
    return (
        <DarkModeContextProvider>
            <div className='AppAdmin'>
                <Routes>
                    <Route path="/*" element={<Home />} />
                </Routes>
            </div>
        </DarkModeContextProvider>
    )
}
