import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, HardHat, ArrowRight } from 'lucide-react';

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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registo efetuado! Verifique o seu email.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-sm w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="mb-8 text-center">
           <div className="inline-block p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 mb-4">
              <HardHat size={24} strokeWidth={1.5} />
           </div>
           <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">ACESSO TÉCNICO</h1>
           <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest">Plataforma Construtec PT</p>
        </div>

        {message && (
          <div className={`p-3 mb-6 text-xs font-mono border ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-1">Email Profissional</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 py-2 px-3 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white focus:bg-white dark:focus:bg-slate-800 transition-colors placeholder-slate-400 dark:placeholder-slate-600 dark:text-white"
              placeholder="user@empresa.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-1">Palavra-passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 py-2 px-3 text-sm focus:outline-none focus:border-slate-900 dark:focus:border-white focus:bg-white dark:focus:bg-slate-800 transition-colors dark:text-white"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-400 text-white dark:text-slate-900 font-medium py-3 text-sm transition-colors flex items-center justify-center gap-2 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : (
              <>
                {isLogin ? 'ENTRAR NO SISTEMA' : 'REGISTAR CONTA'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4"
          >
            {isLogin ? 'Não tem conta? Criar registo' : 'Já tem conta? Iniciar sessão'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;