import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { UserProvider } from './layouts/context/UserContext';
// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <UserProvider>
            <App />
          </UserProvider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
