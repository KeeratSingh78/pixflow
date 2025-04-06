// src/main.tsx
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FirebaseProvider } from './context/FirebaseContext.tsx';

createRoot(document.getElementById('root')!).render(
  <FirebaseProvider>
    <App />
  </FirebaseProvider>
);