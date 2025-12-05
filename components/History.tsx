import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DbSession, Message } from '../types';
import ResultCard from './ResultCard';
import { Clock, Calendar, ChevronRight, Loader2, SearchX, MessageSquare } from 'lucide-react';

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
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-2.5 rounded-xl text-blue-700">
            <Clock size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Histórico de Pesquisas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Lista de Sessões (Sidebar) */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24 max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2">
                <Calendar size={18} /> Consultas Anteriores
              </h2>
            </div>
            
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin text-blue-500" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <SearchX size={32} className="mx-auto mb-2 opacity-50" />
                <p>Ainda não tem histórico.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`w-full text-left p-4 hover:bg-blue-50 transition-all group relative ${selectedSessionId === session.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                  >
                    <h3 className={`font-medium mb-1 line-clamp-2 ${selectedSessionId === session.id ? 'text-blue-800' : 'text-slate-800'}`}>
                      {session.title || "Pesquisa sem título"}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                       <span className="text-xs text-slate-400 font-medium">
                        {formatDate(session.created_at)}
                       </span>
                       <ChevronRight size={16} className={`text-slate-300 group-hover:text-blue-400 transition-colors ${selectedSessionId === session.id ? 'text-blue-500' : ''}`} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Área de Detalhes */}
          <div className="lg:col-span-2">
            {selectedSessionId ? (
              loadingMessages ? (
                <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center shadow-sm border border-slate-200">
                   <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
                   <p className="text-slate-500">A carregar detalhes da consulta...</p>
                </div>
              ) : (
                <div className="space-y-6">
                   {sessionMessages.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       {msg.role === 'user' ? (
                         <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg shadow-blue-600/10">
                           <p className="font-medium">{msg.content}</p>
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
              <div className="bg-slate-50 rounded-2xl p-12 border-2 border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-400">
                  <MessageSquare size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Selecione uma pesquisa</h3>
                <p className="text-slate-500 max-w-md">
                  Clique numa sessão à esquerda para ver os detalhes, preços e empresas que pesquisou anteriormente.
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