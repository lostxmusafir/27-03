import { useState, useEffect } from 'react';
import { X, MapPin, Save } from 'lucide-react';
import db from '../db';
import useStore from '../store/useStore';
import { addLog } from '../utils/logger';

export default function AddCampForm() {
  const { showAddCampForm, setShowAddCampForm, mapClickCoords, setMapClickCoords } = useStore();
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [troopsCount, setTroopsCount] = useState(500);
  const [ammoLevel, setAmmoLevel] = useState(50);
  const [suppliesLevel, setSuppliesLevel] = useState(50);

  useEffect(() => {
    if (mapClickCoords) {
      setLat(mapClickCoords.lat.toFixed(6));
      setLng(mapClickCoords.lng.toFixed(6));
    }
  }, [mapClickCoords]);

  const handleClose = () => {
    setShowAddCampForm(false);
    setMapClickCoords(null);
    setName('');
    setLat('');
    setLng('');
    setTroopsCount(500);
    setAmmoLevel(50);
    setSuppliesLevel(50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !lat || !lng) return;
    await db.camps.add({
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      status: 'normal',
      troopsCount: parseInt(troopsCount),
      ammoLevel: parseInt(ammoLevel),
      suppliesLevel: parseInt(suppliesLevel),
      lastUpdated: new Date().toISOString()
    });
    await addLog(
      `CAMP DEPLOYED: ${name}`,
      'INFO',
      `Coords: ${lat}, ${lng} | Troops: ${troopsCount}`
    );
    useStore.getState().addToast({
      type: 'success',
      title: '✅ CAMP ADDED',
      message: `${name} has been deployed successfully.`
    });
    handleClose();
  };

  if (!showAddCampForm) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-xl w-[420px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h3 className="text-sm font-bold tracking-wider text-emerald-400">DEPLOY NEW CAMP</h3>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 font-mono tracking-widest">CAMP NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
              placeholder="Enter camp name..."
              required
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-mono bg-cyan-900/20 border border-cyan-500/20 rounded-lg p-2">
            <MapPin className="w-4 h-4" />
            Click on the map to set coordinates, or enter manually below.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 font-mono tracking-widest">LATITUDE</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full mt-1 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500/50"
                placeholder="0.000000"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-mono tracking-widest">LONGITUDE</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full mt-1 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500/50"
                placeholder="0.000000"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-mono tracking-widest">TROOPS COUNT</label>
            <input
              type="number"
              value={troopsCount}
              onChange={(e) => setTroopsCount(e.target.value)}
              className="w-full mt-1 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-mono tracking-widest">AMMO LEVEL: {ammoLevel}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={ammoLevel}
              onChange={(e) => setAmmoLevel(e.target.value)}
              className="w-full mt-1 accent-emerald-500"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-mono tracking-widest">SUPPLIES LEVEL: {suppliesLevel}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={suppliesLevel}
              onChange={(e) => setSuppliesLevel(e.target.value)}
              className="w-full mt-1 accent-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-all"
          >
            <Save className="w-4 h-4" />
            DEPLOY CAMP
          </button>
        </form>
      </div>
    </div>
  );
}