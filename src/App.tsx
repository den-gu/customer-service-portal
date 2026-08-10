import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RequestsListPage } from './pages/RequestsListPage';
import { CreateRequestPage } from './pages/CreateRequestPage';
import { RequestDetailPage } from './pages/RequestDetailPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RequestsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/new"
          element={
            <ProtectedRoute>
              <CreateRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/:requestId"
          element={
            <ProtectedRoute>
              <RequestDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;