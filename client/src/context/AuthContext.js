import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/current_user');
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/login', { email, password });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setLoading(false);
            return response.data; // Ensure the promise resolves with user data
        } catch (error) {
            setLoading(false);
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    };

    const signup = async (username, email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/signup', { username, email, password });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            setLoading(false);
            return response.data; // Ensure the promise resolves with user data
        } catch (error) {
            setLoading(false);
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    };

    const logout = async () => {
        setLoading(true);
        await axios.get('/logout');
        setUser(null);
        localStorage.removeItem('user');
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
