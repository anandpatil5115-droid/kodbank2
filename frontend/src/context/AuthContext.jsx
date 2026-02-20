import { createContext, useContext, useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOptions = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    };

    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/auth/me`, { ...fetchOptions, method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(async (userData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        return data;
    }, []);

    const login = useCallback(async (credentials) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        setUser(data.user);
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, { ...fetchOptions, method: 'POST' });
        } catch { }
        setUser(null);
    }, []);

    const getBalance = useCallback(async () => {
        const res = await fetch(`${API_URL}/user/balance`, {
            ...fetchOptions,
            method: 'GET'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch balance');
        return data;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, checkAuth, register, login, logout, getBalance }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
