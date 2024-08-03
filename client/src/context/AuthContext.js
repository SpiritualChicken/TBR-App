import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('/current_user').then(response => {
            setUser(response.data);
        }).catch(() => {
            setUser(null);
        });
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('/login', { email, password });
        setUser(response.data);
    };

    const signup = async (username, email, password) => {
        const response = await axios.post('/signup', { username, email, password });
        setUser(response.data);
    };

    const logout = async () => {
        await axios.get('/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };