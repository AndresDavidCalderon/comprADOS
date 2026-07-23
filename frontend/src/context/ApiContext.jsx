import {createContext, useContext} from 'react';
import AuthContext from './AuthContext.jsx';

const ApiContext = createContext({
    apiUrl: 'http://localhost:8000'
});

export function ApiProvider({ children }) {
    const apiUrl = 'https://friendly-space-lamp-j96jj7vw5j62q5jp-8000.app.github.dev';
    return <ApiContext.Provider value={{ apiUrl }}>{children}</ApiContext.Provider>;
}

export default ApiContext;