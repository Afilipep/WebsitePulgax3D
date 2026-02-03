import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('pulgax-admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('pulgax-token') || null;
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem('pulgax-admin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('pulgax-admin');
    }
  }, [admin]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('pulgax-token', token);
    } else {
      localStorage.removeItem('pulgax-token');
    }
  }, [token]);

  const login = (adminData, accessToken) => {
    setAdmin(adminData);
    setToken(accessToken);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
  };

  const isAuthenticated = !!token && !!admin;

  return (
    <AuthContext.Provider value={{
      admin,
      token,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
