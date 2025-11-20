import React from 'react';

const Logo = ({ size = 40, showText = true, className = '' }) => {
    return (
        <div className={`logo-component ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                </defs>
                <rect width="64" height="64" rx="12" fill="url(#logoGradient)" />
                <path
                    d="M 8 32 L 18 32 L 22 20 L 28 44 L 34 28 L 38 32 L 56 32"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <circle cx="48" cy="20" r="4" fill="white" />
                <path d="M 42 28 Q 42 24 48 24 Q 54 24 54 28 L 54 32 L 42 32 Z" fill="white" />
            </svg>
            {showText && (
                <span style={{
                    fontSize: size * 0.6,
                    fontWeight: '600',
                    color: 'white'
                }}>
                    Customer Pulse
                </span>
            )}
        </div>
    );
};

export default Logo;
