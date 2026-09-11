import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/authApi.js';
import { AuthContext } from './authContextInstance.js';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { admin } = await authApi.me();
      setAdmin(admin);
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- session bootstrap on mount; there is no render-time alternative to reading the httpOnly auth cookie via the API.
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const { admin } = await authApi.login({ email, password });
    setAdmin(admin);
    return admin;
  };

  const logout = async () => {
    await authApi.logout().catch(() => null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
