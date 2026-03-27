import { useLiveQuery } from 'dexie-react-hooks';
import { X, BarChart3, PieChart as PieChartIcon, TrendingUp, Shield } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import db from '../db';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export default function AnalyticsDashboard({ open, onClose }) {
  const camps = useLiveQuery(() => db.camps.toArray());

  if (!open) return null;

  const troopsData = camps?.map((c) => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + '…' : c.name,
    troops: c.troopsCount,
    ammo: c.ammoLevel,
    supplies: c.suppliesLevel,
  })) || [];

  const avgAmmo = camps?.length ? Math.round(camps.reduce((s, c) => s + c.ammoLevel, 0) / camps.length) : 0;
  const avgSupplies = camps?.length ? Math.round(camps.reduce((s, c) => s + c.suppliesLevel, 0) / camps.length) : 0;

  const readinessData = [
    { name: 'Avg Ammo', value: avgAmmo },
    { name: 'Avg Supplies', value: avgSupplies },
    { name: 'Deficit', value: Math.max(0, 100 - avgAmmo - avgSupplies > 0 ? 100 - Math.min(avgAmmo + avgSupplies, 100) : 0) },
  ];

  const statusCounts = {
    normal: camps?.filter((c) => c.status === 'normal').length || 0,
    alert: camps?.filter((c) => c.status === 'alert').length || 0,
    critical: camps?.filter((c) => c.status === 'critical').length || 0,
  };

  const statusData = [
    { name: 'Normal', value: statusCounts.normal, color: '#10b981' },
    { name: 'Alert', value: statusCounts.alert, color: '#f59e0b' },
    { name: 'Critical', value: statusCounts.critical, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const totalTroops = camps?.reduce((s, c) => s + c.troopsCount, 0) || 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass rounded-lg p-3 text-xs">
        <div className="text-slate-300 font-semibold mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-slate-200 font-mono font-bold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-xl w-[900px] max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-wider text-cyan-400">TACTICAL ANALYTICS</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
              <div className="text-[10px] text-slate-500 font-mono tracking-widest">TOTAL CAMPS</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{camps?.length || 0}</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
              <div className="text-[10px] text-slate-500 font-mono tracking-widest">TOTAL TROOPS</div>
              <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{totalTroops.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
              <div className="text-[10px] text-slate-500 font-mono tracking-widest">AVG AMMO</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${avgAmmo < 30 ? 'text-red-400' : avgAmmo < 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>{avgAmmo}%</div>
            </div>
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
              <div className="text-[10px] text-slate-500 font-mono tracking-widest">AVG SUPPLIES</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${avgSupplies < 30 ? 'text-red-400' : avgSupplies < 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>{avgSupplies}%</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Bar Chart - Troops */}
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] text-slate-500 font-mono tracking-widest">TROOPS BY CAMP</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={troopsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="troops" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Readiness */}
            <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-slate-500 font-mono tracking-widest">SYSTEM READINESS</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={readinessData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#06b6d4" />
                    <Cell fill="#334155" />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-slate-800/40 rounded-lg p-4 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span className="text-[10px] text-slate-500 font-mono tracking-widest">CAMP STATUS DISTRIBUTION</span>
            </div>
            <div className="flex gap-4">
              {statusData.map((s) => (
                <div key={s.name} className="flex-1 bg-slate-900/40 rounded-lg p-3 text-center border border-slate-700/20">
                  <div className="text-3xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">{s.name.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}