// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 5.3.6 CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // For Navbar
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);