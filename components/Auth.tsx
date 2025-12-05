import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Lock, Mail, HardHat, ArrowRight } from 'lucide-react';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registo efetuado! Verifique o seu email para confirmar a conta.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Ocorreu um erro. Verifique os dados.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
      {/* Background decoration consistent with SearchHero */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-100 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-50 blur-[100px]" />
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden relative z-10">
        
        {/* Header Brand */}
        <div className="pt-8 pb-4 text-center">
           <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/30 mb-4">
              <HardHat size={32} />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
             Construtec<span className="text-blue-600">PT</span>
           </h1>
           <p className="text-slate-500 text-sm mt-1">Plataforma Inteligente de Construção</p>
        </div>
        
        <div className="p-8 pt-2">
          <div className="flex items-center justify-center gap-1 mb-6 text-sm bg-slate-100 p-1 rounded-lg">
             <button 
               onClick={() => { setIsLogin(true); setMessage(null); }}
               className={`flex-1 py-1.5 rounded-md font-medium transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Entrar
             </button>
             <button 
               onClick={() => { setIsLogin(false); setMessage(null); }}
               className={`flex-1 py-1.5 rounded-md font-medium transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Criar Conta
             </button>
          </div>

          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm flex items-start gap-2 border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
              {message.text}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email Profissional</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400 text-slate-700"
                  placeholder="nome@empresa.pt"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Palavra-passe</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-slate-400 text-slate-700"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isLogin ? 'Iniciar Sessão' : 'Começar Agora'}
                  {!loading && <ArrowRight size={18} />}
                </>
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-xs text-slate-400">
            Protegido por Supabase Auth & RLS Security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;