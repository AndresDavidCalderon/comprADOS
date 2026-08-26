import {createContext, useState} from "react";

const AuthContext = createContext({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const login = (token) => {
        setIsAuthenticated(true);
        setToken(token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
