import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../index.css'; // Import the CSS file

const Navbar = () => {
    const { user, logout, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching user data
    }

    return (
        <nav className="navbar">
            <div className='navhomeitems'>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="BookIndex" className="nav-link">TBR</Link>
            </div> 
            {user ? (
                <div className="user-section">
                    <span className="welcome-message">Welcome, {user.username}</span>
                    <button className="logout-button" onClick={logout}>Logout</button>
                </div>
            ) : (
                <div className="auth-links">
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-link">Signup</Link>

                </div>
            )}
        </nav>
    );
};

export default Navbar;