import { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import App from './App.jsx'
import './index.css'
import './components/components.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error(
        'cannot find <div id="root">'
    )
}

createRoot(rootElement).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
)