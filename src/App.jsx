import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { seedDatabase } from './db';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ToastContainer from './components/ToastContainer';
import AddCampForm from './components/AddCampForm';
import CampDetailPanel from './components/CampDetailPanel';
import CommandTerminal from './components/CommandTerminal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import LoginScreen from './components/LoginScreen';
import useStore from './store/useStore';

function Dashboard() {
  const { showAnalytics, setShowAnalytics, showAddCampForm, setShowAddCampForm, showTerminal, setShowTerminal, setSelectedCamp } = useStore();

  useEffect(() => {
    seedDatabase();
  }, []);

  // Shift+T: Toggle terminal
  useHotkeys('shift+t', () => setShowTerminal(!showTerminal), { enableOnFormTags: false });
  // Shift+A: Open add camp form
  useHotkeys('shift+a', () => setShowAddCampForm(!showAddCampForm), { enableOnFormTags: false });
  // Shift+R: Open analytics
  useHotkeys('shift+r', () => setShowAnalytics(!showAnalytics), { enableOnFormTags: false });
  // Escape: Close all modals/panels
  useHotkeys('escape', () => {
    setShowAddCampForm(false);
    setShowAnalytics(false);
    setSelectedCamp(null);
  }, { enableOnFormTags: true });

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 overflow-hidden">
      <Navbar onOpenAnalytics={() => setShowAnalytics(true)} />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar />
        <MapView />
      </div>
      {showTerminal && <CommandTerminal />}
      <AnalyticsDashboard open={showAnalytics} onClose={() => setShowAnalytics(false)} />
      <CampDetailPanel />
      <AddCampForm />
      <ToastContainer />
    </div>
  );
}

function App() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginScreen />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;