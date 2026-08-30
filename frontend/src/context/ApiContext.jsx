import {createContext, useContext} from 'react';
import AuthContext from './AuthContext.jsx';

const apiUrl = import.meta.env.VITE_API_URL;

const ApiContext = createContext({
    apiUrl: 'URL NOT PROVIDED'
});

export function ApiProvider({ children }) {
    if (!apiUrl) {
        throw new Error('VITE_API_URL environment variable is not set.');
    }
    console.log(apiUrl);
    return <ApiContext.Provider value={{ apiUrl }}>{children}</ApiContext.Provider>;
}

export default ApiContext;