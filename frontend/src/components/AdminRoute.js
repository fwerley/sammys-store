import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../slice/userSlice';

export default function AdminRoute({ children }) {

    const { userInfo } = useSelector(selectUser);

    return userInfo && userInfo.isAdmin ? children : <Navigate to='/signin' />
}
