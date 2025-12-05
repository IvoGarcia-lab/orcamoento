import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, CheckCircle2, Building2, Search, ArrowUpDown, ArrowUp, ArrowDown, ShoppingCart, Phone, Mail } from 'lucide-react';
import { Message, MaterialItem, CompanyItem } from '../types';

interface ResultCardProps {
  message: Message;
}

const ResultCard: React.FC<ResultCardProps> = ({ message }) => {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // --- Sorting & Filtering Logic ---
  const sortedAndFilteredData = useMemo(() => {
    if (!message.data) return [];

    let data = [...message.data];

    // Filter
    if (filterText) {
      const lowerFilter = filterText.toLowerCase();
      data = data.filter((item: any) => 
        Object.values(item).some((val) => 
          String(val).toLowerCase().includes(lowerFilter)
        )
      );
    }

    // Sort
    if (sortConfig) {
      data.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [message.data, filterText, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={14} className="ml-1 opacity-40" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-blue-200" />
      : <ArrowDown size={14} className="ml-1 text-blue-200" />;
  };

  const getContactLink = (contact: string) => {
    if (contact.includes('@')) return `mailto:${contact}`;
    const cleanNum = contact.replace(/[^\d+]/g, '');
    return `tel:${cleanNum}`;
  };

  // --- Render Functions ---

  const renderMaterialsTable = (data: MaterialItem[]) => (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-white uppercase text-xs">
            <tr>
              <th onClick={() => handleSort('produto')} className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-700 transition-colors select-none group">
                <div className="flex items-center">Produto {renderSortIcon('produto')}</div>
              </th>
              <th onClick={() => handleSort('marca')} className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-700 transition-colors select-none">
                <div className="flex items-center">Marca {renderSortIcon('marca')}</div>
              </th>
              <th onClick={() => handleSort('preco_numerico')} className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-700 transition-colors select-none text-right">
                <div className="flex items-center justify-end">Preço {renderSortIcon('preco_numerico')}</div>
              </th>
              <th onClick={() => handleSort('loja')} className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-700 transition-colors select-none">
                <div className="flex items-center">Loja {renderSortIcon('loja')}</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors even:bg-slate-50">
                <td className="px-4 py-3 font-medium">{item.produto}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {item.marca}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600 text-base whitespace-nowrap">
                  {item.preco_texto}
                </td>
                <td className="px-4 py-3 text-blue-600 font-medium">
                  {item.link ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center hover:underline gap-1.5"
                      title="Ver na loja"
                    >
                       {item.loja}
                       <ExternalLink size={14} className="flex-shrink-0 opacity-70" />
                    </a>
                  ) : (
                    item.loja
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
         <div className="p-8 text-center text-slate-500">
            Nenhum resultado encontrado para o filtro aplicado.
         </div>
      )}
    </div>
  );

  const renderCompaniesTable = (data: CompanyItem[]) => (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
       <div className="w-full">
        <table className="w-full text-sm text-left table-fixed">
          <thead className="bg-slate-900 text-white uppercase text-xs">
            <tr>
              <th onClick={() => handleSort('nome')} className="w-1/3 px-3 py-3 font-bold cursor-pointer hover:bg-slate-800 select-none">
                <div className="flex items-center">Empresa {renderSortIcon('nome')}</div>
              </th>
              <th onClick={() => handleSort('local')} className="w-1/5 px-3 py-3 font-bold cursor-pointer hover:bg-slate-800 select-none">
                <div className="flex items-center">Local {renderSortIcon('local')}</div>
              </th>
              <th className="w-1/5 px-3 py-3 font-bold">Contacto</th>
              <th className="w-[27%] px-3 py-3 font-bold">Especialidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors even:bg-slate-50">
                <td className="px-3 py-3 font-bold text-slate-900 break-words align-top">{item.nome}</td>
                <td className="px-3 py-3 align-top">{item.local}</td>
                <td className="px-3 py-3 font-medium text-blue-600 align-top">
                  <a href={getContactLink(item.contacto)} className="flex items-center gap-1.5 hover:underline decoration-blue-300">
                    {item.contacto.includes('@') ? <Mail size={14} className="flex-shrink-0" /> : <Phone size={14} className="flex-shrink-0" />}
                    <span className="truncate">{item.contacto}</span>
                  </a>
                </td>
                <td className="px-3 py-3 align-top">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 break-words leading-snug">
                       {item.especialidade}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {data.length === 0 && (
         <div className="p-8 text-center text-slate-500">
            Nenhum resultado encontrado para o filtro aplicado.
         </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Strip */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {message.dataType === 'materiais' ? 'Tabela de Materiais' : message.dataType === 'empresas' ? 'Lista de Profissionais' : 'Análise Técnica'}
              </h2>
            </div>

            {/* Filter Input for Structured Data */}
            {message.data && message.data.length > 0 && (
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Filtrar resultados..."
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="prose prose-slate max-w-none">
            {message.content && (
                <div className="mb-8 prose-headings:font-bold prose-h3:text-blue-900 prose-p:text-slate-700 prose-strong:text-slate-900">
                    <ReactMarkdown
                    components={{
                        ul: ({node, ...props}) => <ul className="space-y-2 my-4 list-none pl-0" {...props} />,
                        li: ({node, ...props}) => (
                        <li className="flex items-start gap-3 text-slate-700">
                            <CheckCircle2 className="mt-1 min-w-[18px] text-green-500 flex-shrink-0" size={18} />
                            <span {...props} />
                        </li>
                        ),
                    }}
                    >
                    {message.content}
                    </ReactMarkdown>
                </div>
            )}

            {/* Structured Data Tables */}
            {message.dataType === 'materiais' && message.data && renderMaterialsTable(sortedAndFilteredData as MaterialItem[])}
            {message.dataType === 'empresas' && message.data && renderCompaniesTable(sortedAndFilteredData as CompanyItem[])}
            
          </div>

          {/* Sources Section */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Fontes Consultadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {message.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700">
                        {source.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{new URL(source.url).hostname}</p>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;