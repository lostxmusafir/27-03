import { useState } from 'react';
import { X, Truck, Crosshair, Package } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db';
import useStore from '../store/useStore';
import { addLog } from '../utils/logger';

export default function DispatchConvoyModal({ open, onClose, sourceCamp }) {
  const camps = useLiveQuery(() => db.camps.toArray());
  const [targetId, setTargetId] = useState('');
  const [payloadType, setPayloadType] = useState('ammo');

  if (!open || !sourceCamp) return null;

  const destinations = camps?.filter((c) => c.id !== sourceCamp.id) || [];

  const handleDispatch = async () => {
    if (!targetId) return;
    const target = camps?.find((c) => c.id === parseInt(targetId));
    if (!target) return;

    const convoyId = await db.convoys.add({
      sourceCampId: sourceCamp.id,
      targetCampId: target.id,
      progress: 0,
      payloadType,
      startedAt: new Date().toISOString()
    });

    await addLog(
      `CONVOY DISPATCHED: ${sourceCamp.name} → ${target.name}`,
      'INFO',
      `Payload: ${payloadType.toUpperCase()} | Convoy #${convoyId}`
    );

    useStore.getState().addToast({
      type: 'info',
      title: '🚛 CONVOY DISPATCHED',
      message: `${payloadType.toUpperCase()} convoy en route to ${target.name}`
    });

    useStore.getState().addActiveConvoy({
      id: convoyId,
      sourceLat: sourceCamp.lat,
      sourceLng: sourceCamp.lng,
      targetLat: target.lat,
      targetLng: target.lng,
      targetCampId: target.id,
      payloadType,
      progress: 0
    });

    setTargetId('');
    setPayloadType('ammo');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-xl w-[400px] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-bold tracking-wider text-orange-400">DISPATCH CONVOY</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/30">
            <div className="text-[10px] text-slate-500 font-mono tracking-widest mb-1">SOURCE</div>
            <div className="text-sm font-semibold text-emerald-400">{sourceCamp.name}</div>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-mono tracking-widest">DESTINATION CAMP</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full mt-1 bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50"
            >
              <option value="">Select destination...</option>
              {destinations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Ammo: {c.ammoLevel}% | Supplies: {c.suppliesLevel}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 font-mono tracking-widest">PAYLOAD TYPE</label>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setPayloadType('ammo')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                  payloadType === 'ammo'
                    ? 'bg-orange-600/30 border-orange-500/50 text-orange-400'
                    : 'bg-slate-800/40 border-slate-700/30 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Crosshair className="w-4 h-4" />
                AMMO (+20%)
              </button>
              <button
                onClick={() => setPayloadType('supplies')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                  payloadType === 'supplies'
                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-400'
                    : 'bg-slate-800/40 border-slate-700/30 text-slate-400 hover:border-slate-600'
                }`}
              >
                <Package className="w-4 h-4" />
                SUPPLIES (+20%)
              </button>
            </div>
          </div>

          <button
            onClick={handleDispatch}
            disabled={!targetId}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2.5 rounded-lg transition-all"
          >
            <Truck className="w-4 h-4" />
            DISPATCH CONVOY
          </button>
        </div>
      </div>
    </div>
  );
}