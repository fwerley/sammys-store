import React from 'react'

export default function SuccessCircleAnimate({dimension}) {
    return (
        <div className="success-animation" style={{ fontSize: 24 }}>
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style={{width: dimension, height: dimension}}>
                <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke-linejoin="round" stroke-linecap="round" />
                <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" stroke-linejoin="round" stroke-linecap="round" />
            </svg>
        </div>
    )
}
