import { useState, useEffect } from 'react';
import { Shield, Radio, Clock, Wifi } from 'lucide-react';

export default function Navbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).toUpperCase();
  };

  return (
    <nav className="glass h-14 flex items-center justify-between px-6 z-50 relative">
      <div className="flex items-center gap-3">
        <Shield className="w-7 h-7 text-emerald-400" />
        <div>
          <h1 className="text-lg font-bold tracking-wider text-emerald-400">
            PROJECT RAKSHAK
          </h1>
          <p className="text-[10px] text-slate-400 tracking-widest -mt-1">
            COMMAND CENTER
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-slate-300">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono">SYSTEM ONLINE</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono">LINK ACTIVE</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <Clock className="w-4 h-4 text-cyan-400" />
          <div className="text-right">
            <div className="text-lg font-mono font-bold text-cyan-300 tracking-wider">
              {formatTime(time)}
            </div>
            <div className="text-[9px] text-slate-500 font-mono tracking-wider">
              {formatDate(time)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}