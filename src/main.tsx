import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './auth/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.tsx'
import { Toaster } from './components/ui/toast.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* <Main initialExpanded={false}> */}
          <Toaster />
          <App />
          {/* </Main> */}
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
});
