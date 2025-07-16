import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // ✅ Import this
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider> {/* ✅ Wrap with HelmetProvider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
