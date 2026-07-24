import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '10px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
            style: { background: '#fff', color: '#1e293b', border: '1px solid #d1fae5' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
            style: { background: '#fff', color: '#1e293b', border: '1px solid #fee2e2' },
          },
        }}
      />
    </>
  );
}
