import {createContext, useContext} from 'react';
import AuthContext from './AuthContext.jsx';

const ApiContext = createContext({
    apiUrl: 'http://localhost:8000'
});

export function ApiProvider({ children }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    return <ApiContext.Provider value={{ apiUrl }}>{children}</ApiContext.Provider>;
}

export default ApiContext;