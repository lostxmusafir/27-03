import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, Terminal } from 'lucide-react';

const HARDCODED_PASSCODE = 'RAKSHAK-007';

export default function LoginScreen() {
  const [passcode, setPasscode] = useState('');
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [error, setError] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const fullText = 'INITIALIZING RAKSHAK PROTOCOL... ENTER CLEARANCE CODE';

  useEffect(() => {
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypingText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setShowInput(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === HARDCODED_PASSCODE) {
      setError(false);
      navigate('/dashboard');
    } else {
      setError(true);
      setPasscode('');
      setTimeout(() => setError(false), 1500);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridPulse 4s ease-in-out infinite'
        }} />
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)'
        }} />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-emerald-500/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-emerald-500/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-emerald-500/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-emerald-500/30" />

      {/* Main login container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Glowing border container */}
        <div className={`relative p-8 rounded-lg border-2 transition-all duration-300 ${error
            ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-shake'
            : 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
          }`}>
          {/* Glass background */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl rounded-lg" />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className={`p-3 rounded-full ${error ? 'bg-red-500/20' : 'bg-emerald-500/20'} transition-colors`}>
                {error ? (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                ) : (
                  <Shield className="w-8 h-8 text-emerald-400" />
                )}
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className={`text-2xl font-bold tracking-wider mb-2 ${error ? 'text-red-500' : 'text-emerald-400'} transition-colors`}>
                {error ? 'ACCESS DENIED' : 'RESTRICTED ACCESS'}
              </h1>
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <Terminal className="w-4 h-4" />
                <span className="text-xs font-mono">SECURITY LEVEL: ALPHA</span>
              </div>
            </div>

            {/* Typing text */}
            <div className="mb-8 min-h-[48px]">
              <p className="text-center text-sm font-mono text-cyan-400">
                {typingText}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>

            {/* Input form */}
            {showInput && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className={`w-5 h-5 ${error ? 'text-red-500' : 'text-slate-500'}`} />
                  </div>
                  <input
                    ref={inputRef}
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="ENTER CLEARANCE CODE"
                    className={`w-full bg-slate-800/50 border ${error ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg px-10 py-3 text-center text-lg font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all`}
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-400 py-3 rounded-lg font-semibold tracking-wider transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
                >
                  AUTHENTICATE
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-center gap-2 text-slate-600 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SECURE CONNECTION ESTABLISHED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-6 text-slate-600 text-xs font-mono">
          PROJECT RAKSHAK v2.0 • COMMAND CENTER
        </div>
      </div>

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}