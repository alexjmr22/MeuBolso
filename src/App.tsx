import { Routes, Route } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import Login from './pages/Login';
import HomePage from './assets/HomePage';
import AddData from './components/AddData';

// novas páginas
import Personal from './pages/Personal';
import Couple from './pages/Couple';
import Goals from './pages/Goals';

export default function App() {
  return (
    <Routes>
      {/* rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<AddData />} />

      {/* rotas privadas */}
      <Route
        path="/"
        element={
          <AuthGate>
            <HomePage />
          </AuthGate>
        }
      />
      <Route
        path="/personal"
        element={
          <AuthGate>
            <Personal />
          </AuthGate>
        }
      />
      <Route
        path="/couple"
        element={
          <AuthGate>
            <Couple />
          </AuthGate>
        }
      />
      <Route
        path="/goals"
        element={
          <AuthGate>
            <Goals />
          </AuthGate>
        }
      />

    </Routes>
  );
}
