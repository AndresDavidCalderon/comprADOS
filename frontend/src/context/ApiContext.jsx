import {createContext, useContext} from 'react';
import AuthContext from './AuthContext.jsx';

const ApiContext = createContext({
    apiUrl: 'http://localhost:8000'
});

export function ApiProvider({ children }) {
    const apiUrl = 'http://localhost:8000';
    return <ApiContext.Provider value={{ apiUrl }}>{children}</ApiContext.Provider>;
}

export default ApiContext;