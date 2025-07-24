// src/context/useAuth.js
import { useContext } from 'react';
import { AuthContext } from './auth-context-object'; // Import the context object

export const useAuth = () => useContext(AuthContext);