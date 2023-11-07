// AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('loggedIn') === 'true');

  const login = (username) => {
    sessionStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem("username" , username)
    window.cookie = "we"
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
