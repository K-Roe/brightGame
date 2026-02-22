import * as SecureStore from "expo-secure-store"; // <--- Add this import!
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token on startup
  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      // Use the correct ASYNC method names
      const token = await SecureStore.getItemAsync("user-token");
      setAuthToken(token);
    } catch (e) {
      console.error("Failed to load token", e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token) => {
    try {
      await SecureStore.setItemAsync("user-token", token);
      console.log("Token stored successfully");
      setAuthToken(token);
    } catch (e) {
      console.error("Failed to store token", e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("user-token"); // Correct method name
      setAuthToken(null);
    } catch (e) {
      console.error("Failed to delete token", e);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
