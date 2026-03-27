import { useEffect } from 'react';
import { seedDatabase } from './db';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ToastContainer from './components/ToastContainer';
import AddCampForm from './components/AddCampForm';
import CampDetailPanel from './components/CampDetailPanel';

function App() {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900 overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MapView />
      </div>
      <CampDetailPanel />
      <AddCampForm />
      <ToastContainer />
    </div>
  );
}

export default App;