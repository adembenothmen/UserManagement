import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Auth from './Auth';
import { CookiesProvider } from 'react-cookie';

const Root = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminId") // persistent login
  );

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <CookiesProvider>
      {isLoggedIn ? <App /> : <Auth onLoginSuccess={handleLoginSuccess} />}
    </CookiesProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
