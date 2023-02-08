import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../slice/userSlice';

export default function ProtectedRoute({ children }) {

    const {userInfo} = useSelector(selectUser);

    return userInfo ? children : <Navigate to='/signin' />
}
