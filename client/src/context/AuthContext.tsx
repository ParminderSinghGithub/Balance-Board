import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../utils/apiBaseUrl';

interface AuthContextType {
    token: string | null;
    userId: string | null;
    userName: string | null;
    isLoggedIn: boolean;
    login: (token: string, userId: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUserName = localStorage.getItem('userName');
        if (storedToken && storedUserId) {
            setToken(storedToken);
            setUserId(storedUserId);
            setUserName(storedUserName);
            
            // Fetch updated user profile if name is not stored
            if (!storedUserName) {
                fetchUserProfile(storedToken);
            }
        }
    }, []);

    const fetchUserProfile = async (authToken: string) => {
        try {
            const response = await fetch(`${getApiBaseUrl()}/auth/profile`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.name) {
                    setUserName(data.name);
                    localStorage.setItem('userName', data.name);
                }
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    const login = (newToken: string, newUserId: string) => {
        setToken(newToken);
        setUserId(newUserId);
        localStorage.setItem('token', newToken);
        localStorage.setItem('userId', newUserId);
        
        // Fetch user profile to get name
        fetchUserProfile(newToken);
        
        navigate('/cashflow');
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        setUserName(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const value = {
        token,
        userId,
        userName,
        isLoggedIn: !!token,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
