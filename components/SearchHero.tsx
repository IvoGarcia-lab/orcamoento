import React, { useState } from 'react';
import { Search, ArrowRight, Loader2, Trello, Package, Users } from 'lucide-react';
import { SearchCategory } from '../types';

interface SearchHeroProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  activeCategory: SearchCategory;
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, isLoading, activeCategory }) => {
  const [inputValue, setInputValue] = useState('');

  const getPlaceholder = () => {
    switch (activeCategory) {
      case 'materiais': return "Ex: Tijolo térmico 30x20x15...";
      case 'empresas': return "Ex: Empreiteiro em Lisboa...";
      default: return "Ex: Isolamento acústico parede meeira...";
    }
  };

  const getTitle = () => {
     switch (activeCategory) {
      case 'materiais': return "Base de Dados de Materiais";
      case 'empresas': return "Diretório Técnico";
      default: return "Consultoria Técnica IA";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  return (
    <div className="relative py-20 lg:py-32 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Sistema RGEU Compatível v2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 font-sans">
            {getTitle()}
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto font-light leading-relaxed">
            Plataforma de inteligência artificial para análise de normas construtivas, 
            orçamentação de materiais e validação de empresas em Portugal.
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 opacity-50 blur transition duration-200 group-hover:opacity-75"></div>
              <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1 shadow-sm focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500 transition-all">
                <div className="pl-4 pr-2 text-slate-400">
                  <Search size={20} strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full bg-transparent border-none outline-none py-4 text-slate-900 dark:text-white placeholder-slate-400 text-lg font-medium"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-3 hover:bg-blue-600 dark:hover:bg-blue-400 disabled:bg-slate-100 disabled:text-slate-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 transition-colors rounded-none min-w-[3rem] flex items-center justify-center"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-12 flex justify-center gap-8 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-400 dark:group-hover:border-slate-600 transition-all">
                <Trello size={20} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">Normas</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-400 dark:group-hover:border-slate-600 transition-all">
                <Package size={20} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">Materiais</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:border-slate-400 dark:group-hover:border-slate-600 transition-all">
                <Users size={20} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">Empresas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHero;