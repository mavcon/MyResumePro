import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_EXPIRY_TIME = 3600000; // 1 hour in milliseconds

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    
    if (storedToken && tokenTimestamp) {
      const isExpired = Date.now() - parseInt(tokenTimestamp) > TOKEN_EXPIRY_TIME;
      if (isExpired) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTimestamp');
        localStorage.removeItem('user');
        return null;
      }
      return storedToken;
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  });

  useEffect(() => {
    let logoutTimer;
    if (token) {
      const tokenTimestamp = parseInt(localStorage.getItem('tokenTimestamp'));
      const timeLeft = tokenTimestamp + TOKEN_EXPIRY_TIME - Date.now();
      
      if (timeLeft <= 0) {
        logout();
      } else {
        logoutTimer = setTimeout(logout, timeLeft);
      }
    }
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('tokenTimestamp', Date.now().toString());
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    localStorage.removeItem('user');
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
