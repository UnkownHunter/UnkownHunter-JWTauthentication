import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { getCurrentUser, logout } from '../../api/auth';
import './Navbar.css';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const u = await getCurrentUser();
                setUser(u);
            } catch (err) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null; // Don't show navbar if not logged in

    return (
        <nav className="navbar glass-panel">
            <div className="container flex items-center justify-between">
                <Link to="/" className="nav-brand">
                    <LayoutDashboard className="nav-icon" />
                    <span>PrimeTask</span>
                </Link>
                <div className="nav-actions">
                    <div className="user-profile">
                        <User size={18} />
                        <span className="user-name">{user.username} <span className="user-role">({user.role})</span></span>
                    </div>
                    <button className="nav-logout" onClick={handleLogout} title="Logout">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
