import React from 'react';
import { HardHat, Menu, History as HistoryIcon, Search, Moon, Sun } from 'lucide-react';
import { SearchCategory, ViewMode } from '../types';

interface HeaderProps {
  activeCategory: SearchCategory;
  onCategoryChange: (category: SearchCategory) => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeCategory, onCategoryChange, currentView, onViewChange, theme, onToggleTheme }) => {
  const getLinkClass = (category: SearchCategory) => {
    if (currentView === 'history') return "cursor-pointer px-1 py-1 text-sm font-medium text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors border-b-2 border-transparent";

    return activeCategory === category
      ? "cursor-pointer px-1 py-1 text-sm font-semibold text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white"
      : "cursor-pointer px-1 py-1 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onViewChange('search')}
        >
          <div className="bg-slate-900 dark:bg-white dark:text-slate-950 text-white p-2 rounded-none group-hover:bg-blue-600 dark:group-hover:bg-blue-400 transition-colors">
            <HardHat size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight text-slate-900 dark:text-white">CONSTRUTEC</span>
            <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Portugal</span>
          </div>
        </div>
        
        {/* Navegação Central */}
        <nav className={`hidden md:flex items-center gap-8 transition-opacity duration-300 ${currentView === 'history' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <button onClick={() => onCategoryChange('solucoes')} className={getLinkClass('solucoes')}>
            Soluções Técnicas
          </button>
          <button onClick={() => onCategoryChange('materiais')} className={getLinkClass('materiais')}>
            Materiais & Preços
          </button>
          <button onClick={() => onCategoryChange('empresas')} className={getLinkClass('empresas')}>
            Profissionais
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            title={theme === 'dark' ? "Modo Claro" : "Modo Escuro"}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => onViewChange(currentView === 'search' ? 'history' : 'search')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border ${currentView === 'history' ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'}`}
          >
            {currentView === 'search' ? (
              <>
                <HistoryIcon size={16} />
                <span className="hidden sm:inline">Histórico</span>
              </>
            ) : (
              <>
                <Search size={16} />
                <span className="hidden sm:inline">Pesquisa</span>
              </>
            )}
          </button>

          <button className="hidden md:block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 hover:bg-blue-600 dark:hover:bg-blue-400 transition-colors text-sm font-medium tracking-wide">
            ORÇAMENTO
          </button>
          <button className="md:hidden text-slate-900 dark:text-white">
            <Menu size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;