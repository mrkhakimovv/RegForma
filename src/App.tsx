/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

function ShortcutHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '7') {
        if (location.pathname === '/admin') {
          navigate('/');
        } else {
          setShowPrompt(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '7744') {
      navigate('/admin');
      setShowPrompt(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  const closePrompt = () => {
    setShowPrompt(false);
    setPassword('');
    setError(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-[#151619] border border-white/10 rounded-[32px] p-8 w-full max-w-[320px] shadow-2xl relative"
          >
            <button
              onClick={closePrompt}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-white text-xl font-bold mb-2 text-center">Admin Panel</h3>
            <p className="text-white/50 text-[13px] text-center mb-6">Parolni kiriting</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  autoFocus
                  placeholder="••••"
                  className={`w-full bg-white/5 border rounded-2xl py-3 px-5 text-center text-white placeholder:text-white/20 focus:outline-none transition-colors ${
                    error ? 'border-[#ff4e4e] focus:border-[#ff4e4e]' : 'border-white/10 focus:border-[#FEC204]/50'
                  }`}
                />
                {error && <p className="text-[#ff4e4e] text-[11px] text-center mt-2">Noto'g'ri parol</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-[#FEC204] hover:bg-[#ffd13d] text-[#0a0a0f] font-extrabold py-3 rounded-[20px] uppercase tracking-wider text-[13px] shadow-[0_0_30px_rgba(254,194,4,0.3)] transition-all duration-300"
              >
                Kirish
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ShortcutHandler />
      <main className="min-h-screen w-full bg-[#0a0a0f] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
        {/* Atmospheric Background Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#FEC204] opacity-10 blur-[120px] rounded-full z-0 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#4a00ff] opacity-10 blur-[100px] rounded-full z-0 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#1a1a2e] to-[#0a0a0f] rounded-full opacity-50 z-0 pointer-events-none" />

        <div className="w-full relative z-10">
          <Routes>
            <Route path="/" element={<RegistrationForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>

        {/* Subtle UI Elements */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20 text-[10px] tracking-widest uppercase pointer-events-none text-center w-full">
          Secure &bull; Firebase Data Protection
        </div>
      </main>
    </Router>
  );
}
