import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DbSession, Message } from '../types';
import ResultCard from './ResultCard';
import { Clock, Calendar, ChevronRight, Loader2, SearchX, MessageSquare, Trash2, FileDown, AlertTriangle } from 'lucide-react';

const History: React.FC = () => {
  const [sessions, setSessions] = useState<DbSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);
    }
  }, [selectedSessionId]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transformar mensagens da DB para o formato da App
      const formattedMessages: Message[] = (data || []).map((msg: any) => {
        let structuredData = undefined;
        let content = msg.content;
        let dataType: any = 'text';

        // Tentar detetar se é JSON (dados estruturados)
        if (msg.role === 'assistant') {
          try {
            if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
              structuredData = JSON.parse(content);
              // Tentar inferir o tipo de dados baseado na estrutura
              if (Array.isArray(structuredData) && structuredData.length > 0) {
                if ('preco_numerico' in structuredData[0]) dataType = 'materiais';
                else if ('contacto' in structuredData[0]) dataType = 'empresas';
              }
            }
          } catch (e) {
            // Não é JSON, manter como texto
          }
        }

        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          content: structuredData ? undefined : content,
          data: structuredData,
          dataType: dataType
        };
      });

      setSessionMessages(formattedMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!confirm('Tem a certeza que deseja eliminar permanentemente este registo?')) return;

    try {
      const { error } = await supabase.from('sessions').delete().eq('id', sessionId);
      
      if (error) {
        throw error;
      }
      
      // Apenas atualiza a UI se a base de dados confirmar a eliminação
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
        setSessionMessages([]);
      }
    } catch (error: any) {
      console.error('Erro ao eliminar sessão:', error);
      
      // Feedback específico para erro de permissão (RLS)
      if (error.code === '42501' || error.message?.includes('policy')) {
        alert('⚠️ Erro de Permissão (RLS)\n\nA sua base de dados impediu a eliminação.\nÉ necessário ativar a política "DELETE" na tabela "sessions" no Supabase.');
      } else {
        alert('Não foi possível eliminar o registo. Tente novamente.');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-none text-blue-700 dark:text-blue-300">
              <Clock size={24} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Histórico Técnico</h1>
          </div>
          {selectedSessionId && !loadingMessages && (
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-300 transition-colors text-sm font-medium no-print uppercase tracking-wide"
            >
              <FileDown size={16} />
              Exportar PDF
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Lista de Sessões (Sidebar) - Hidden on Print */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden sticky top-24 max-h-[80vh] overflow-y-auto sidebar-history">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <h2 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Calendar size={14} /> Registo de Atividade
              </h2>
            </div>
            
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin text-slate-400" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <SearchX size={32} className="mx-auto mb-2 opacity-30" strokeWidth={1} />
                <p className="text-sm font-light">Sem registos no arquivo.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group relative cursor-pointer flex justify-between items-start ${selectedSessionId === session.id ? 'bg-slate-50 dark:bg-slate-900 border-l-2 border-slate-900 dark:border-white' : 'border-l-2 border-transparent'}`}
                  >
                    <div className="flex-1 pr-4">
                      <h3 className={`font-medium mb-1 line-clamp-2 text-sm ${selectedSessionId === session.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                        {session.title || "Pesquisa sem título"}
                      </h3>
                      <div className="flex items-center mt-2">
                         <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {formatDate(session.created_at)}
                         </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <button 
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                            title="Eliminar registo"
                        >
                            <Trash2 size={14} />
                        </button>
                        <ChevronRight size={14} className={`text-slate-300 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white transition-colors ${selectedSessionId === session.id ? 'text-slate-900 dark:text-white' : ''}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Área de Detalhes - Full Width on Print */}
          <div className="lg:col-span-2 details-history">
            {selectedSessionId ? (
              loadingMessages ? (
                <div className="bg-white dark:bg-slate-950 p-12 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-800">
                   <Loader2 className="animate-spin text-slate-400" size={24} />
                   <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-mono uppercase tracking-widest">A carregar dados...</p>
                </div>
              ) : (
                <div className="space-y-8">
                   {sessionMessages.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'user' ? (
                         <div className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-6 py-4 border-l-2 border-slate-300 dark:border-slate-700 max-w-[90%] no-print">
                           <p className="font-medium font-sans text-lg">{msg.content}</p>
                         </div>
                       ) : (
                         <div className="w-full">
                           <ResultCard message={msg} />
                         </div>
                       )}
                     </div>
                   ))}
                </div>
              )
            ) : (
              <div className="bg-white dark:bg-slate-950 p-12 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                  <MessageSquare size={32} strokeWidth={1} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Arquivo Técnico</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md font-light text-sm">
                  Selecione um registo à esquerda para consultar relatórios técnicos, tabelas de preços e contactos armazenados.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default History;