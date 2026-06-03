import './App.css';
import AuthPage from './pages/Login/AuthPage';
import Home from './pages/Home/Home';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';

function AppShell() {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ProtectedRoute user={user}>
      <Home />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
