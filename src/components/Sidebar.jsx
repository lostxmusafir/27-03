import { useLiveQuery } from 'dexie-react-hooks';
import { MapPin, Plus, AlertTriangle, Shield, Crosshair } from 'lucide-react';
import db from '../db';
import useStore from '../store/useStore';
import { addLog } from '../utils/logger';

const statusConfig = {
  normal: { color: 'bg-emerald-500', text: 'text-emerald-400', label: 'NORMAL' },
  alert: { color: 'bg-yellow-500', text: 'text-yellow-400', label: 'ALERT' },
  critical: { color: 'bg-red-500', text: 'text-red-400', label: 'CRITICAL' },
};

export default function Sidebar() {
  const camps = useLiveQuery(() => db.camps.toArray());
  const { setSelectedCamp, selectedCamp, setShowAddCampForm } = useStore();

  const handleSimulateAlert = async () => {
    if (!camps || camps.length === 0) return;
    const randomIndex = Math.floor(Math.random() * camps.length);
    const camp = camps[randomIndex];
    const newAmmo = Math.floor(Math.random() * 15) + 5;
    const newSupplies = Math.floor(Math.random() * 15) + 5;
    await db.camps.update(camp.id, {
      status: 'critical',
      ammoLevel: newAmmo,
      suppliesLevel: newSupplies,
      lastUpdated: new Date().toISOString()
    });
    await addLog(
      `ALERT: ${camp.name} status changed to CRITICAL`,
      'CRITICAL',
      `Ammo: ${newAmmo}%, Supplies: ${newSupplies}%`
    );
    useStore.getState().addToast({
      type: 'error',
      title: '⚠️ ALERT TRIGGERED',
      message: `${camp.name} is in CRITICAL condition!`
    });
  };

  return (
    <aside className="glass w-80 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-wider text-slate-200">COMMAND PANEL</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddCampForm(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            ADD CAMP
          </button>
          <button
            onClick={handleSimulateAlert}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            SIMULATE ALERT
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-[10px] text-slate-500 font-mono tracking-widest mb-2 px-1">
          ACTIVE CAMPS ({camps?.length || 0})
        </div>
        {camps?.map((camp) => {
          const status = statusConfig[camp.status] || statusConfig.normal;
          const isSelected = selectedCamp?.id === camp.id;
          return (
            <div
              key={camp.id}
              onClick={() => setSelectedCamp(camp)}
              className={`glass-light rounded-lg p-3 cursor-pointer transition-all hover:border-emerald-500/40 ${
                isSelected ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${status.text}`} />
                  <span className="text-sm font-semibold text-slate-200">{camp.name}</span>
                </div>
                <span className={`text-[9px] font-mono font-bold ${status.text} ${status.color}/20 px-1.5 py-0.5 rounded`}>
                  {status.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-mono">TROOPS</div>
                  <div className="text-xs font-bold text-slate-300">{camp.troopsCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-mono">AMMO</div>
                  <div className={`text-xs font-bold ${camp.ammoLevel < 20 ? 'text-red-400' : 'text-slate-300'}`}>
                    {camp.ammoLevel}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-slate-500 font-mono">SUPPLY</div>
                  <div className={`text-xs font-bold ${camp.suppliesLevel < 20 ? 'text-red-400' : 'text-slate-300'}`}>
                    {camp.suppliesLevel}%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[9px] text-slate-600 font-mono">
                <Crosshair className="w-3 h-3" />
                {camp.lat.toFixed(4)}, {camp.lng.toFixed(4)}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}