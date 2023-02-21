import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../slice/userSlice';

export default function UserListScreen() {

    const { users, loading, error } = useSelector(selectUser)
    return (
        <div>

        </div>
    )
}
