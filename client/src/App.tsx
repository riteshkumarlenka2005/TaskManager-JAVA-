import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import DocumentEditorPage from './pages/DocumentEditorPage';
import DrawingPage from './pages/DrawingPage';

import LandingPage from './pages/LandingPage';
import MobileLayout from './components/mobile/MobileLayout';
import MobileHome from './pages/mobile/MobileHome';
import MobileTasks from './pages/mobile/MobileTasks';
 
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
 
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};
 
function AppRoutes() {
  return (
    <Routes>
      {/* Root - Landing Page */}
      <Route path="/" element={<LandingPage />} />
 
      {/* Public */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
 
      {/* Private with Layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/documents/:id" element={<DocumentEditorPage />} />
        <Route path="/drawing" element={<DrawingPage />} />
      </Route>

      {/* Mobile App Routes (Dedicated UI) */}
      <Route path="/mobile" element={<PrivateRoute><MobileLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="/mobile/home" replace />} />
        <Route path="home" element={<MobileHome />} />
        <Route path="tasks" element={<MobileTasks />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
