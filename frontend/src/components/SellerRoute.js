import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../slice/userSlice';

export default function SellerRoute({ children }) {

    const {userInfo} = useSelector(selectUser);

    return userInfo && (userInfo.isSeller || userInfo.isAdmin) ? children : <Navigate to='/signin' />
}
