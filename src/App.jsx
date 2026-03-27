import { useEffect, useState } from 'react';
import { seedDatabase } from './db';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ToastContainer from './components/ToastContainer';
import AddCampForm from './components/AddCampForm';
import CampDetailPanel from './components/CampDetailPanel';
import CommandTerminal from './components/CommandTerminal';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 overflow-hidden">
      <Navbar onOpenAnalytics={() => setShowAnalytics(true)} />
        <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar />
        <MapView />
      </div>
      <CommandTerminal />
      <AnalyticsDashboard open={showAnalytics} onClose={() => setShowAnalytics(false)} />
        <CampDetailPanel />
      <AddCampForm />
      <ToastContainer />
    </div>
  );
}

export default App;