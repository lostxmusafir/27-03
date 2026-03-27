import { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Terminal, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import db from '../db';

const typeColors = {
  INFO: 'text-emerald-400',
  WARNING: 'text-yellow-400',
  CRITICAL: 'text-red-400',
};

const typePrefixes = {
  INFO: '[INFO]',
  WARNING: '[WARN]',
  CRITICAL: '[CRIT]',
};

export default function CommandTerminal() {
  const [expanded, setExpanded] = useState(true);
  const logsEndRef = useRef(null);
  const logs = useLiveQuery(() => db.logs.orderBy('timestamp').reverse().limit(200).toArray());

  useEffect(() => {
    if (logsEndRef.current && expanded) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, expanded]);

  const handleClearLogs = async () => {
    await db.logs.clear();
  };

  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={`glass border-t border-emerald-500/20 transition-all duration-300 ${expanded ? 'h-48' : 'h-10'}`}>
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-slate-800/40 select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold">COMMAND TERMINAL</span>
          <span className="text-[9px] font-mono text-slate-600">({logs?.length || 0} entries)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleClearLogs(); }}
            className="text-slate-600 hover:text-red-400 transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expanded ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {expanded && (
        <div className="overflow-y-auto px-4 pb-2" style={{ height: 'calc(100% - 36px)', background: 'rgba(0,0,0,0.4)' }}>
          {(!logs || logs.length === 0) && (
            <div className="text-[11px] font-mono text-slate-600 italic mt-2">Awaiting command input...</div>
          )}
          {logs?.map((log) => (
            <div key={log.id} className="flex items-start gap-2 py-0.5 font-mono text-[11px] leading-5">
              <span className="text-slate-600 flex-shrink-0">{formatTimestamp(log.timestamp)}</span>
              <span className={`${typeColors[log.type] || 'text-slate-400'} flex-shrink-0 font-bold`}>
                {typePrefixes[log.type] || '[INFO]'}
              </span>
              <span className="text-slate-300">{log.action}</span>
              {log.details && <span className="text-slate-500">— {log.details}</span>}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}