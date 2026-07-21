import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Phone, GraduationCap, Calendar, Search, Eye, Smartphone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

type Registration = {
  id: string;
  fullName: string;
  phoneNumber: string;
  grade: string;
  createdAt: any;
};

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    const q = query(
      collection(db, 'registrations'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Registration[];
      setRegistrations(data);
      setLoading(false);
    });

    const statsRef = doc(db, 'statistics', 'visits');
    const unsubscribeStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        setVisitorCount(docSnap.data().count || 0);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeStats();
    };
  }, []);

  const filteredRegistrations = registrations.filter((reg) =>
    reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.phoneNumber.includes(searchTerm)
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Admin Panel</h1>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-white/50 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <Users className="w-4 h-4 text-[#FEC204]" />
              Jami ro'yxatdan o'tganlar: <span className="text-[#FEC204] font-bold text-base ml-1">{registrations.length}</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <Eye className="w-4 h-4 text-[#FEC204]" />
              Saytga kirgan qurilmalar soni: <span className="text-[#FEC204] font-bold text-base ml-1">{visitorCount}</span>
            </div>
          </div>
        </div>
        
        <div className="relative w-full md:w-auto mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Qidirish (ism, raqam)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FEC204]/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-[32px] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-[11px] uppercase tracking-widest bg-white/5">
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Ism va Familiya</div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> Telefon Raqam</div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Sinf</div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Qurilma</div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Manzil</div>
                </th>
                <th className="py-4 px-6 font-semibold">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Sana</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/50">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/50">
                    Ma'lumot topilmadi
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={reg.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors text-white text-sm"
                  >
                    <td className="py-4 px-6 font-medium">{reg.fullName}</td>
                    <td className="py-4 px-6 font-mono text-white/80">
                      <a href={`tel:${reg.phoneNumber.replace(/\s/g, '')}`} className="hover:text-blue-400 hover:underline transition-colors">
                        {reg.phoneNumber}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 bg-[#FEC204]/10 text-[#FEC204] rounded-full text-xs font-semibold">
                        {reg.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white/80">{reg.device || "Noma'lum"}</td>
                    <td className="py-4 px-6 text-white/80">{reg.location || "Noma'lum"}</td>
                    <td className="py-4 px-6 text-white/60">{formatDate(reg.createdAt)}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
