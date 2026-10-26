import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App'; import { ThemeProvider } from './features/theme/ThemeContext'; import { store } from './app/store'; import './index.css';
createRoot(document.getElementById('root')!).render(<StrictMode><Provider store={store}><ThemeProvider><BrowserRouter><App /></BrowserRouter></ThemeProvider></Provider></StrictMode>);
