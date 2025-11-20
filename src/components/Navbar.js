import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, UserPlus, Phone, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Logo size={32} showText={true} />
            </div>
            <ul className="navbar-nav">
                <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                    <Link to="/" className="nav-link">
                        <Home size={20} />
                        Dashboard
                    </Link>
                </li>
                <li className={`nav-item ${isActive('/customers') ? 'active' : ''}`}>
                    <Link to="/customers" className="nav-link">
                        <Users size={20} />
                        Customers
                    </Link>
                </li>
                <li className={`nav-item ${isActive('/leads') ? 'active' : ''}`}>
                    <Link to="/leads" className="nav-link">
                        <UserPlus size={20} />
                        Leads
                    </Link>
                </li>
                <li className={`nav-item ${isActive('/contacts') ? 'active' : ''}`}>
                    <Link to="/contacts" className="nav-link">
                        <Phone size={20} />
                        Contacts
                    </Link>
                </li>
            </ul>
            <div className="navbar-user" ref={dropdownRef}>
                <div
                    className="user-profile"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <div className="user-avatar">
                        {getInitials(user?.name)}
                    </div>
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-email">{user?.email || ''}</span>
                    </div>
                    <ChevronDown size={18} className={`dropdown-icon ${showDropdown ? 'open' : ''}`} />
                </div>
                {showDropdown && (
                    <div className="user-dropdown">
                        <div className="dropdown-header">
                            <div className="dropdown-avatar">
                                {getInitials(user?.name)}
                            </div>
                            <div>
                                <div className="dropdown-name">{user?.name}</div>
                                <div className="dropdown-email">{user?.email}</div>
                                {user?.company && (
                                    <div className="dropdown-company">{user?.company}</div>
                                )}
                            </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={() => {
                            navigate('/profile');
                            setShowDropdown(false);
                        }}>
                            <User size={18} />
                            <span>Profile Settings</span>
                        </button>
                        <button className="dropdown-item logout" onClick={handleLogout}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
