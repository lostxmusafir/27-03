import { useState, useEffect, useRef } from 'react';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import useStore from '../store/useStore';

const PASSCODE = 'RAKSHAK-007';

export default function LoginScreen() {
  const [code, setCode] = useState('');
  const [typingText, setTypingText] = useState('');
  const [denied, setDenied] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);
  const setIsAuthenticated = useStore((s) => s.setIsAuthenticated);

  const fullText = 'INITIALIZING RAKSHAK PROTOCOL... ENTER CLEARANCE CODE';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypingText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setShowInput(true);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === PASSCODE) {
      setIsAuthenticated(true);
    } else {
      setDenied(true);
      setCode('');
      setTimeout(() => setDenied(false), 1500);
    }
  };

  return (
    <div className={`h-screen w-screen flex items-center justify-center bg-slate-950 transition-all duration-300 ${denied ? 'animate-access-denied' : ''}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(16,185,129,0.1) 2px, rgba(16,185,129,0.1) 4px)',
        }} />
      </div>

      <div className="relative z-10 w-[440px]">
        <div className={`glass rounded-xl overflow-hidden border ${denied ? 'border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]'} transition-all duration-500`}>
          <div className="p-8 text-center border-b border-slate-700/50">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${denied ? 'bg-red-500/20' : 'bg-emerald-500/20'} transition-colors`}>
              {denied ? (
                <AlertTriangle className="w-8 h-8 text-red-400" />
              ) : (
                <Shield className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <h1 className={`text-xl font-bold tracking-widest ${denied ? 'text-red-400' : 'text-emerald-400'} transition-colors`}>
              {denied ? 'ACCESS DENIED' : 'RESTRICTED ACCESS'}
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">
              PROJECT RAKSHAK — COMMAND CENTER
            </p>
          </div>

          <div className="p-8">
            <div className="bg-black/40 rounded-lg p-4 mb-6 border border-slate-800/50">
              <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                <span className="text-slate-600">> </span>
                {typingText}
                <span className="animate-pulse">█</span>
              </p>
            </div>

            {showInput && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    ref={inputRef}
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="ENTER CLEARANCE CODE"
                    className={`w-full bg-black/40 border ${denied ? 'border-red-500/60' : 'border-emerald-500/30'} rounded-lg pl-10 pr-4 py-3 text-sm font-mono text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-400 font-mono font-bold py-3 rounded-lg text-sm tracking-widest transition-all"
                >
                  AUTHENTICATE
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-[9px] text-slate-600 font-mono tracking-widest">
                UNAUTHORIZED ACCESS IS PROHIBITED
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes access-denied {
          0%, 100% { background-color: rgb(2, 6, 23); }
          25% { background-color: rgba(239, 68, 68, 0.15); }
          50% { background-color: rgba(239, 68, 68, 0.08); }
          75% { background-color: rgba(239, 68, 68, 0.15); }
        }
        .animate-access-denied {
          animation: access-denied 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}