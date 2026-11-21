import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { TaskProvider } from './context/TaskProvider.jsx';
import { ThemeProvider } from './context/ThemeProvider.jsx';
import { ToastProvider } from './context/ToastProvider.jsx';
import '@fontsource-variable/inter';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <TaskProvider>
            <App />
          </TaskProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
