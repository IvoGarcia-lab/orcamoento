import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchHero from './components/SearchHero';
import ResultCard from './components/ResultCard';
import Features from './components/Features';
import Auth from './components/Auth';
import History from './components/History';
import { getConstructionAdvice } from './services/gemini';
import { Message, LoadingState, SearchCategory, ViewMode } from './types';
import { supabase } from './lib/supabase';
import { LogOut, User } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('solucoes');
  const [currentView, setCurrentView] = useState<ViewMode>('search');
  
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((err) => {
        console.error("Erro ao verificar sessão inicial:", err);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveInteractionToSupabase = async (query: string, result: any, category: string) => {
    if (!session?.user?.id) return;

    try {
      const { data: dbSession, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: session.user.id,
          title: query,
          status: 'closed'
        })
        .select()
        .single();

      if (sessionError || !dbSession) throw sessionError;

      await supabase.from('messages').insert({
        session_id: dbSession.id,
        role: 'user',
        content: query
      });

      const aiContent = result.structuredData 
        ? JSON.stringify(result.structuredData) 
        : result.text;

      await supabase.from('messages').insert({
        session_id: dbSession.id,
        role: 'assistant',
        content: aiContent
      });

    } catch (err) {
      console.error("Erro ao guardar no Supabase:", err);
    }
  };

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
      
      saveInteractionToSupabase(query, result, activeCategory);

      const sources = result.groundingMetadata?.groundingChunks
        ?.map(chunk => chunk.web ? { title: chunk.web.title, url: chunk.web.uri } : null)
        .filter((item): item is { title: string; url: string } => item !== null) || [];

      const newMessage: Message = {
        role: 'model',
        sources: sources,
        dataType: activeCategory === 'materiais' || activeCategory === 'empresas' ? activeCategory : 'text'
      };

      if (result.structuredData && (activeCategory === 'materiais' || activeCategory === 'empresas')) {
         newMessage.data = result.structuredData;
         newMessage.content = undefined; 
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
    if (currentView === 'history') setCurrentView('search');
    
    if (loadingState === LoadingState.SUCCESS || currentMessage) {
        setCurrentMessage(null);
        setLoadingState(LoadingState.IDLE);
    }
  };

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans select-none transition-colors duration-300">
      <div className="bg-slate-900 dark:bg-black border-b border-slate-800 text-slate-400 text-[10px] font-mono py-1 px-6 flex justify-between items-center uppercase tracking-wider">
        <div className="flex items-center gap-2">
            <User size={12} /> 
            <span>{session.user.email}</span>
        </div>
        <button onClick={handleLogout} className="hover:text-white flex items-center gap-1 transition-colors">
            <LogOut size={12} /> SAIR
        </button>
      </div>

      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
        currentView={currentView}
        onViewChange={handleViewChange}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <main className="flex-grow">
        {currentView === 'history' ? (
          <History />
        ) : (
          <>
            <SearchHero 
              onSearch={handleSearch} 
              isLoading={loadingState === LoadingState.LOADING} 
              activeCategory={activeCategory}
            />

            <div className="container mx-auto px-6 -mt-10 mb-20 relative z-10">
              {loadingState === LoadingState.LOADING && (
                <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto rounded-xl">
                   <div className="relative">
                     <div className="w-12 h-12 border-2 border-slate-100 dark:border-slate-800 border-t-slate-900 dark:border-t-blue-500 rounded-full animate-spin"></div>
                   </div>
                   <p className="mt-6 text-slate-500 dark:text-slate-400 text-sm font-mono uppercase tracking-widest animate-pulse">
                     Processamento Técnico em Curso...
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
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors duration-300">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-xs font-mono uppercase tracking-widest">
            © {new Date().getFullYear()} Construtec Portugal. Powered by Gemini & Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;