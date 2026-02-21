import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on startup
  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    const token = await AsyncStorage.getItem('user-token');
    setAuthToken(token);
    setIsLoading(false);
  };

  const login = async (token) => {
    await AsyncStorage.setItem('user-token', token);
    setAuthToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user-token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);