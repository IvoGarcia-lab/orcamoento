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

  // Verificar autenticação ao iniciar
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((err) => {
        console.error("Erro ao verificar sessão inicial:", err);
        // Não bloqueia a app, apenas loga o erro. 
        // O utilizador verá o ecrã de Auth se a sessão for nula.
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none">
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <User size={12} /> 
            <span>{session.user.email}</span>
        </div>
        <button onClick={handleLogout} className="hover:text-white flex items-center gap-1">
            <LogOut size={12} /> Sair
        </button>
      </div>

      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
        currentView={currentView}
        onViewChange={handleViewChange}
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
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Construtec Portugal. Powered by Gemini & Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;