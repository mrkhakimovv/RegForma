import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type FormData = {
  fullName: string;
  phoneNumber: string;
  grade: string;
};

const GRADE_OPTIONS = ['9-sinf', '10-sinf', '11-sinf'];

export function RegistrationForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorToast, setErrorToast] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      phoneNumber: '+998 ',
      grade: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setErrorToast(false);
    try {
      await addDoc(collection(db, 'registrations'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      
      // Simulate success
      setIsSuccess(true);
      reset({ fullName: '', phoneNumber: '+998 ', grade: '' });
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorToast(true);
      setTimeout(() => setErrorToast(false), 5000);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Basic formatting for +998 XX XXX XX XX
    const cleaned = value.replace(/\D/g, '').slice(3); // Remove all non-digits and country code part
    
    let formatted = '+998 ';
    if (cleaned.length > 0) formatted += cleaned.substring(0, 2);
    if (cleaned.length > 2) formatted += ' ' + cleaned.substring(2, 5);
    if (cleaned.length > 5) formatted += ' ' + cleaned.substring(5, 7);
    if (cleaned.length > 7) formatted += ' ' + cleaned.substring(7, 9);
    
    return formatted.trim();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Toast Error Notification */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-red-500/90 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <AlertCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold text-sm">Xatolik yuz berdi.</p>
              <p className="text-xs text-red-100">Iltimos qayta urinib ko'ring.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[500px] mx-auto bg-white/5 backdrop-blur-[32px] border border-white/10 rounded-[40px] p-8 sm:p-12 shadow-2xl"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            Ro'yxatdan o'tish
          </h2>
          <p className="text-white/50 text-sm">Ma'lumotlaringizni kiriting va biz bilan bog'laning</p>
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-[0.1em] text-white/40 font-semibold ml-2">
                    Ism va Familiya
                  </label>
                  <input
                    type="text"
                    {...register('fullName', { required: 'Bu maydon majburiy' })}
                    className={cn(
                      "w-full bg-white/5 border rounded-2xl py-4 px-5 text-white placeholder:text-white/20 focus:outline-none transition-colors",
                      errors.fullName ? "border-[#ff4e4e] focus:border-[#ff4e4e]" : "border-white/10 focus:border-[#FEC204]/50"
                    )}
                    placeholder="Alisher Usmonov"
                  />
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#ff4e4e] text-[10px] ml-2"
                      >
                        {errors.fullName.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-[0.1em] text-white/40 font-semibold ml-2">
                    Telefon Raqam
                  </label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                      required: 'Telefon raqam majburiy',
                      pattern: {
                        value: /^\+998 \d{2} \d{3} \d{2} \d{2}$/,
                        message: "Noto'g'ri format (+998 XX XXX XX XX)",
                      },
                    }}
                    render={({ field: { onChange, value } }) => (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (!val.startsWith('+998')) val = '+998 ' + val.replace(/^\+?998\s*/, '');
                          onChange(formatPhoneNumber(val));
                        }}
                        className={cn(
                          "w-full bg-white/5 border rounded-2xl py-4 px-5 text-white placeholder:text-white/20 focus:outline-none transition-colors",
                          errors.phoneNumber ? "border-[#ff4e4e] focus:border-[#ff4e4e]" : "border-white/10 focus:border-[#FEC204]/50"
                        )}
                        placeholder="+998 90 123 45 67"
                      />
                    )}
                  />
                  <AnimatePresence>
                    {errors.phoneNumber && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#ff4e4e] text-[10px] ml-2"
                      >
                        {errors.phoneNumber.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Grade */}
                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-[0.1em] text-white/40 font-semibold ml-2">
                    Sinf
                  </label>
                  <div className="relative group">
                    <select
                      {...register('grade', { required: 'Sinfni tanlang' })}
                      className={cn(
                        "w-full appearance-none bg-white/5 border rounded-2xl py-4 px-5 text-white focus:outline-none cursor-pointer transition-colors",
                        errors.grade ? "border-[#ff4e4e] focus:border-[#ff4e4e]" : "border-white/10 focus:border-[#FEC204]/50"
                      )}
                    >
                      <option value="" className="bg-[#1a1a2e]">Sinfni tanlang</option>
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade} className="bg-[#1a1a2e]">
                          {grade}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
                  </div>
                  <AnimatePresence>
                    {errors.grade && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#ff4e4e] text-[10px] ml-2"
                      >
                        {errors.grade.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className={cn(
                    "w-full bg-[#FEC204] hover:bg-[#ffd13d] text-[#0a0a0f] font-extrabold py-5 rounded-[24px] uppercase tracking-wider text-sm shadow-[0_0_30px_rgba(254,194,4,0.3)] transition-all duration-300 mt-4 flex items-center justify-center gap-3",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      YUBORILMOQDA...
                    </>
                  ) : (
                    "RO'YXATDAN O'TISH"
                  )}
                </motion.button>
              </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Success Modal Preview (Overlayed) */}
      <AnimatePresence>
        {isSuccess && (
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
              className="bg-[#151619] border border-white/10 rounded-[32px] p-10 w-full max-w-[400px] text-center shadow-2xl relative"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-500 w-10 h-10" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-3">Tabriklaymiz!</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Siz muvaffaqiyatli ro'yxatdan o'tdingiz.<br />
                Operatorlarimiz tez orada siz bilan bog'lanadi.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Yopish
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
