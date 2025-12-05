import React from 'react';
import { ShieldCheck, Zap, Globe2 } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800">
          <div className="p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
            <ShieldCheck size={32} strokeWidth={1} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white mb-4 transition-colors" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Normativa RGEU</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Conformidade rigorosa com o Regulamento Geral das Edificações Urbanas e legislação nacional.
            </p>
          </div>
          
          <div className="p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
            <Zap size={32} strokeWidth={1} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white mb-4 transition-colors" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Análise de Custo</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Algoritmos de comparação para materiais de construção, isolamentos e acabamentos.
            </p>
          </div>

          <div className="p-8 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
            <Globe2 size={32} strokeWidth={1} className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white mb-4 transition-colors" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Indústria Nacional</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
              Base de dados focada em fornecedores e fabricantes portugueses para redução da pegada de carbono.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;