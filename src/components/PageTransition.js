import React, { useEffect, useState } from 'react';
import './PageTransition.css';

const PageTransition = ({ children }) => {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [children]);

    return (
        <div className={`page-wrapper ${isAnimating ? 'page-enter' : 'page-enter-active'}`}>
            {children}
        </div>
    );
};

export default PageTransition;