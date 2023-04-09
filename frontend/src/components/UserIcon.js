import React from 'react'
import { Heart, Person } from 'react-bootstrap-icons'

export function UserIcon() {
    return (
        <div className="circle">
            <Person />
        </div>
    )
}

export function HeartIcon() {
    return (
        <div className="circle">
            <Heart />
        </div>
    )
}