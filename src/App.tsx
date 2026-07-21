/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  return (
    <Router>
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
