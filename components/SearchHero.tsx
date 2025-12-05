import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { SearchCategory } from '../types';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  activeCategory: SearchCategory;
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isLoading, activeCategory }) => {
  const [inputValue, setInputValue] = useState('');

  // Update placeholder based on category
  const getPlaceholder = () => {
    switch (activeCategory) {
      case 'materiais':
        return "Ex: Preço de telha lusa da Robbialac ou tijolo térmico...";
      case 'empresas':
        return "Ex: Empresas de construção civil em Braga especializadas em remodelação...";
      default:
        return "Ex: Qual a melhor solução para isolamento térmico em Lisboa?";
    }
  };

  const getTitle = () => {
     switch (activeCategory) {
      case 'materiais':
        return <>Preços reais de <span className="gradient-text">Materiais</span> em Portugal</>;
      case 'empresas':
        return <>Encontre <span className="gradient-text">Empresas</span> de confiança</>;
      default:
        return <>As melhores soluções construtivas em <span className="gradient-text">Portugal</span></>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white py-16 lg:py-24 transition-all duration-500">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-50 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight min-h-[3.5rem]">
          {getTitle()}
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          {activeCategory === 'materiais' 
            ? 'Consulte marcas, compare preços de catálogo e encontre fornecedores nacionais.'
            : activeCategory === 'empresas'
            ? 'Pesquise empreiteiros, arquitetos e engenheiros avaliados na sua zona.'
            : 'Inteligência artificial especializada no Regulamento Geral das Edificações Urbanas (RGEU) e normas portuguesas.'}
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group z-10">
          <div className="absolute inset-0 bg-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-slate-100 p-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
            <Search className="ml-4 text-slate-400" size={24} />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full bg-transparent border-none outline-none px-4 py-3 text-slate-700 placeholder-slate-400 text-lg select-text"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
          {activeCategory === 'solucoes' && (
            <>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">🏠 Renovação</span>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">🏗️ Estruturas</span>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">⚡ Eficiência</span>
            </>
          )}
          {activeCategory === 'materiais' && (
            <>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">🧱 Tijolo & Cerâmica</span>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">🎨 Tintas</span>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">🪵 Madeiras</span>
            </>
          )}
           {activeCategory === 'empresas' && (
            <>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">👷 Empreiteiros</span>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">📐 Arquitetos</span>
              <span className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">🔧 Canalizadores</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHero;