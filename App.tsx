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

  // Robust Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check local storage first, then system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') return 'dark';
      if (stored === 'light') return 'light';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Verificar autenticação ao iniciar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
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
      // 1. Criar Sessão
      const { data: dbSession, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: session.user.id,
          title: query,
          status: 'closed' // Consideramos fechada após a resposta neste modelo de search
        })
        .select()
        .single();

      if (sessionError || !dbSession) throw sessionError;

      // 2. Guardar Mensagem do User
      await supabase.from('messages').insert({
        session_id: dbSession.id,
        role: 'user',
        content: query
      });

      // 3. Guardar Resposta da IA (Seja texto ou JSON stringificado)
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
      
      // Persistir no Supabase em background
      saveInteractionToSupabase(query, result, activeCategory);

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
    // Se estiver no histórico, volta para pesquisa ao mudar categoria
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

  // Se não houver sessão, mostrar ecrã de Auth
  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col font-sans select-none transition-colors duration-300">
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 text-[10px] font-mono py-1 px-4 flex justify-between items-center no-print border-b border-slate-800">
        <div className="flex items-center gap-2">
            <User size={12} /> 
            <span>{session.user.email}</span>
        </div>
        <button onClick={handleLogout} className="hover:text-white flex items-center gap-1 transition-colors">
            <LogOut size={12} /> Sair
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
            <div className="no-print">
              <SearchHero 
                onSearch={handleSearch} 
                isLoading={loadingState === LoadingState.LOADING} 
                activeCategory={activeCategory}
              />
            </div>

            <div className="container mx-auto px-4 -mt-10 mb-20 relative z-10">
              {loadingState === LoadingState.LOADING && (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                   <div className="relative">
                     <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-blue-600 dark:text-blue-400">
                       <span className="text-xs font-bold">AI</span>
                     </div>
                   </div>
                   <p className="mt-6 text-slate-600 dark:text-slate-400 font-medium animate-pulse text-center max-w-md">
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
                <div className="no-print">
                  <Features />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12 transition-colors duration-300 no-print">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 dark:text-slate-600 text-sm font-mono">
            © {new Date().getFullYear()} Construtec Portugal. Powered by Gemini & Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;