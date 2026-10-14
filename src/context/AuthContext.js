import { createContext } from 'react';

// Delar inloggad användare och token mellan sidor utan att skicka props genom hela trädet.
export const AuthContext = createContext();