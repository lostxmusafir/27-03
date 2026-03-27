import { useState, useEffect } from 'react';
import { X, Save, Trash2, MapPin, Users, Crosshair, Package, Truck } from 'lucide-react';
import DispatchConvoyModal from './DispatchConvoyModal';
import db from '../db';
import useStore from '../store/useStore';
import { addLog } from '../utils/logger';

export default function CampDetailPanel() {
  const { selectedCamp, setSelectedCamp } = useStore();
  const [troopsCount, setTroopsCount] = useState(0);
  const [ammoLevel, setAmmoLevel] = useState(0);
  const [suppliesLevel, setSuppliesLevel] = useState(0);
  const [showConvoyModal, setShowConvoyModal] = useState(false);

  useEffect(() => {
    if (selectedCamp) {
      setTroopsCount(selectedCamp.troopsCount);
      setAmmoLevel(selectedCamp.ammoLevel);
      setSuppliesLevel(selectedCamp.suppliesLevel);
    }
  }, [selectedCamp]);

  if (!selectedCamp) return null;

  const handleSave = async () => {
    const newStatus = ammoLevel < 20 || suppliesLevel < 20 ? 'critical' : ammoLevel < 40 || suppliesLevel < 40 ? 'alert' : 'normal';
    await db.camps.update(selectedCamp.id, {
      troopsCount: parseInt(troopsCount),
      ammoLevel: parseInt(ammoLevel),
      suppliesLevel: parseInt(suppliesLevel),
      status: newStatus,
      lastUpdated: new Date().toISOString()
    });
    const updated = await db.camps.get(selectedCamp.id);
    setSelectedCamp(updated);
    const logType = newStatus === 'critical' ? 'CRITICAL' : newStatus === 'alert' ? 'WARNING' : 'INFO';
    await addLog(
      `CAMP UPDATED: ${selectedCamp.name}`,
      logType,
      `Troops: ${troopsCount} | Ammo: ${ammoLevel}% | Supplies: ${suppliesLevel}% | Status: ${newStatus.toUpperCase()}`
    );
    useStore.getState().addToast({
      type: 'success',
      title: '✅ CAMP UPDATED',
      message: `${selectedCamp.name} resources updated.`
    });
  };

  const handleDelete = async () => {
    const campName = selectedCamp.name;
    await db.camps.delete(selectedCamp.id);
    setSelectedCamp(null);
    await addLog(
      `CAMP DECOMMISSIONED: ${campName}`,
      'WARNING',
      'All resources released'
    );
    useStore.getState().addToast({
      type: 'info',
      title: '🗑️ CAMP REMOVED',
      message: `${campName} has been decommissioned.`
    });
  };

  const statusColor = selectedCamp.status === 'critical' ? 'text-red-400' : selectedCamp.status === 'alert' ? 'text-yellow-400' : 'text-emerald-400';

  return (
    <div className="fixed right-0 top-14 bottom-0 w-96 glass z-[9990] flex flex-col animate-slide-right">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <MapPin className={`w-5 h-5 ${statusColor}`} />
          <h3 className="text-sm font-bold text-slate-200">{selectedCamp.name}</h3>
        </div>
        <button onClick={() => setSelectedCamp(null)} className="text-slate-500 hover:text-slate-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
          <div className="text-[10px] text-slate-500 font-mono tracking-widest mb-1">STATUS</div>
          <div className={`text-lg font-bold ${statusColor}`}>{selectedCamp.status.toUpperCase()}</div>
          <div className="text-[10px] text-slate-600 font-mono mt-1">
            Last Updated: {new Date(selectedCamp.lastUpdated).toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
          <div className="text-[10px] text-slate-500 font-mono tracking-widest mb-1">COORDINATES</div>
          <div className="text-sm font-mono text-slate-300">
            {selectedCamp.lat.toFixed(6)}, {selectedCamp.lng.toFixed(6)}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <label className="text-[10px] text-slate-500 font-mono tracking-widest">TROOPS COUNT</label>
            </div>
            <input
              type="number"
              value={troopsCount}
              onChange={(e) => setTroopsCount(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-orange-400" />
              <label className="text-[10px] text-slate-500 font-mono tracking-widest">AMMO LEVEL: {ammoLevel}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ammoLevel}
              onChange={(e) => setAmmoLevel(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full transition-all ${ammoLevel < 20 ? 'bg-red-500' : ammoLevel < 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                style={{ width: `${ammoLevel}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-400" />
              <label className="text-[10px] text-slate-500 font-mono tracking-widest">SUPPLIES LEVEL: {suppliesLevel}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={suppliesLevel}
              onChange={(e) => setSuppliesLevel(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full transition-all ${suppliesLevel < 20 ? 'bg-red-500' : suppliesLevel < 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                style={{ width: `${suppliesLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-700/50 space-y-2">
        <button
          onClick={() => setShowConvoyModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/30 text-orange-400 font-semibold py-2.5 rounded-lg transition-all text-sm"
        >
          <Truck className="w-4 h-4" />
          DISPATCH CONVOY
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            SAVE
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 font-semibold px-4 py-2.5 rounded-lg transition-all text-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DispatchConvoyModal
        open={showConvoyModal}
        onClose={() => setShowConvoyModal(false)}
        sourceCamp={selectedCamp}
      />
    </div>
  );
}