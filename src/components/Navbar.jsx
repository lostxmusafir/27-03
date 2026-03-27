import { useState, useEffect } from 'react';
import { Shield, Radio, Clock, Wifi, BarChart3, Keyboard, X } from 'lucide-react';

const hotkeys = [
  { keys: 'Shift + T', desc: 'Toggle Command Terminal' },
  { keys: 'Shift + A', desc: 'Add New Camp' },
  { keys: 'Shift + R', desc: 'Open Analytics Dashboard' },
  { keys: 'Escape', desc: 'Close All Modals/Panels' },
];

export default function Navbar({ onOpenAnalytics }) {
  const [time, setTime] = useState(new Date());
  const [showHelp, setShowHelp] = useState(false);

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
        <button
          onClick={onOpenAnalytics}
          className="flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
        >
          <BarChart3 className="w-4 h-4" />
          ANALYTICS
        </button>

        <div className="flex items-center gap-2 text-slate-300">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono">SYSTEM ONLINE</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-mono">LINK ACTIVE</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-1.5 bg-slate-800/40 hover:bg-slate-700/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg text-xs transition-all"
          >
            <Keyboard className="w-4 h-4" />
            <span className="font-mono">HOTKEYS</span>
          </button>

          {showHelp && (
            <div className="absolute right-0 top-full mt-2 glass rounded-lg p-4 w-72 z-[9999]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-emerald-400 font-mono tracking-widest font-bold">KEYBOARD SHORTCUTS</span>
                <button onClick={() => setShowHelp(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-2">
                {hotkeys.map((h) => (
                  <div key={h.keys} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{h.desc}</span>
                    <kbd className="bg-slate-800 border border-slate-600 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
                      {h.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}
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