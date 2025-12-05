import React, { useState } from 'react';
import Header from './components/Header';
import SearchHero from './components/SearchHero';
import ResultCard from './components/ResultCard';
import Features from './components/Features';
import { getConstructionAdvice } from './services/gemini';
import { Message, LoadingState, SearchCategory, MaterialItem, CompanyItem } from './types';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('solucoes');

  const handleSearch = async (query: string) => {
    setLoadingState(LoadingState.LOADING);
    setCurrentMessage(null);
    
    let enrichedQuery = query;
    if (activeCategory === 'materiais') {
      enrichedQuery = `Encontrar preços reais em Portugal para: "${query}". Lojas como Leroy Merlin, Maxmat.`;
    } else if (activeCategory === 'empresas') {
      enrichedQuery = `Encontrar uma lista abrangente (mínimo 10 resultados) de empresas de construção em Portugal para: "${query}". Priorizar quem tem contacto.`;
    } else {
      enrichedQuery = `Solução técnica construtiva para: "${query}". Contexto Portugal.`;
    }

    try {
      const result = await getConstructionAdvice(enrichedQuery, activeCategory);
      
      const sources = result.groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web ? { title: chunk.web.title, url: chunk.web.uri } : null)
        .filter((item): item is { title: string; url: string } => item !== null) || [];

      // Determine message structure based on result type
      const newMessage: Message = {
        role: 'model',
        sources: sources,
        dataType: activeCategory === 'materiais' || activeCategory === 'empresas' ? activeCategory : 'text'
      };

      if (result.structuredData && (activeCategory === 'materiais' || activeCategory === 'empresas')) {
         newMessage.data = result.structuredData;
         newMessage.content = undefined; // No text content needed if we have table
      } else {
         newMessage.content = result.text || "Não foi possível gerar uma resposta. Tente novamente.";
      }

      setCurrentMessage(newMessage);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
      setCurrentMessage({
        role: 'model',
        content: "Ocorreu um erro inesperado. Por favor tente novamente.",
        dataType: 'text'
      });
    }
  };

  const handleCategoryChange = (category: SearchCategory) => {
    setActiveCategory(category);
    if (loadingState === LoadingState.SUCCESS || currentMessage) {
        setCurrentMessage(null);
        setLoadingState(LoadingState.IDLE);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      <main className="flex-grow">
        <SearchHero 
          onSearch={handleSearch} 
          isLoading={loadingState === LoadingState.LOADING} 
          activeCategory={activeCategory}
        />

        <div className="container mx-auto px-4 -mt-10 mb-20 relative z-10">
          {loadingState === LoadingState.LOADING && (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl">
               <div className="relative">
                 <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                   <span className="text-xs font-bold">AI</span>
                 </div>
               </div>
               <p className="mt-6 text-slate-600 font-medium animate-pulse text-center max-w-md">
                 {activeCategory === 'materiais' 
                   ? 'A recolher preços e a organizar tabela...' 
                   : activeCategory === 'empresas' 
                     ? 'A compilar lista abrangente de profissionais...' 
                     : 'A analisar normas e redigir solução...'}
               </p>
            </div>
          )}

          {currentMessage && loadingState !== LoadingState.LOADING && (
            <ResultCard message={currentMessage} />
          )}

          {loadingState === LoadingState.IDLE && (
            <Features />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Construtec Portugal. Powered by Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;