import React from 'react';
import { HardHat, Menu, History as HistoryIcon, Search } from 'lucide-react';
import { SearchCategory, ViewMode } from '../types';

interface HeaderProps {
  activeCategory: SearchCategory;
  onCategoryChange: (category: SearchCategory) => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ activeCategory, onCategoryChange, currentView, onViewChange }) => {
  const getLinkClass = (category: SearchCategory) => {
    // Desativar highlight se estivermos no histórico
    if (currentView === 'history') return "cursor-pointer transition-all px-3 py-2 rounded-lg font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50";

    return activeCategory === category
      ? "cursor-pointer transition-all px-3 py-2 rounded-lg font-medium text-blue-600 bg-blue-50 font-semibold"
      : "cursor-pointer transition-all px-3 py-2 rounded-lg font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50";
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onViewChange('search')}
        >
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-600/20">
            <HardHat size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">
            Construtec<span className="text-blue-600">PT</span>
          </span>
        </div>
        
        {/* Navegação Central - Só visível no modo Pesquisa */}
        <nav className={`hidden md:flex items-center gap-2 text-sm transition-opacity duration-300 ${currentView === 'history' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <button 
            onClick={() => onCategoryChange('solucoes')} 
            className={getLinkClass('solucoes')}
          >
            Soluções Técnicas
          </button>
          <button 
            onClick={() => onCategoryChange('materiais')} 
            className={getLinkClass('materiais')}
          >
            Materiais & Preços
          </button>
          <button 
            onClick={() => onCategoryChange('empresas')} 
            className={getLinkClass('empresas')}
          >
            Empresas & Profissionais
          </button>
        </nav>

        <div className="flex items-center gap-3">
          {/* Toggle View Button */}
          <button
            onClick={() => onViewChange(currentView === 'search' ? 'history' : 'search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${currentView === 'history' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {currentView === 'search' ? (
              <>
                <HistoryIcon size={18} />
                <span className="hidden sm:inline">Histórico</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span className="hidden sm:inline">Nova Pesquisa</span>
              </>
            )}
          </button>

          <button className="hidden md:block bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all hover:shadow-lg text-sm font-medium">
            Pedir Orçamento
          </button>
          <button className="md:hidden text-slate-600 p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;