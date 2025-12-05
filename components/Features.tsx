import React from 'react';
import { ShieldCheck, Zap, Globe2 } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Normas Portuguesas</h3>
            <p className="text-slate-600 leading-relaxed">
              Todas as recomendações seguem os regulamentos de construção em vigor em Portugal (RGEU, REH).
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Orçamentos Inteligentes</h3>
            <p className="text-slate-600 leading-relaxed">
              Analise custos-benefícios de materiais como capoto, cortiça ou cerâmicas nacionais.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Globe2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Sustentabilidade Local</h3>
            <p className="text-slate-600 leading-relaxed">
              Priorizamos materiais produzidos em Portugal para reduzir a pegada ecológica da sua obra.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;