import { useState, useEffect, useCallback } from "react";
import { register, login, logout, getCurrentUser } from '../api/auth';
import { AuthContext } from "./AuthContextInstance";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setLoading(true);
                const response = await getCurrentUser();
                if (response && response.success) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error('Auth status check failed: ', error)
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    const registerUser = useCallback(async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await register(userData);
            if (response && response.success) {
                setUser(response.user);
            }
            return response;
        } catch (error) {
            setError(error.message || 'Registration failed');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const loginUser = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(credentials);
            if (response && response.success){
                setUser(response.user);
            }
            return response;
        } catch (error) {
            setError(error.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logoutUser = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            setError(error.message || 'Logout failed');
            console.error('Logout error: ', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value = {
        user,
        loading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        clearError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}