import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, CheckCircle2, Building2, Search, ArrowUpDown, ArrowUp, ArrowDown, ShoppingCart, Phone, Mail, MapPin, Store, Tag } from 'lucide-react';
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
    if (sortConfig?.key !== key) return <ArrowUpDown size={14} className="ml-1 opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-blue-600" />
      : <ArrowDown size={14} className="ml-1 text-blue-600" />;
  };

  const getContactLink = (contact: string) => {
    if (contact.includes('@')) return `mailto:${contact}`;
    const cleanNum = contact.replace(/[^\d+]/g, '');
    return `tel:${cleanNum}`;
  };

  // --- Render Functions ---

  const renderMaterialsTable = (data: MaterialItem[]) => (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th onClick={() => handleSort('produto')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                <div className="flex items-center">Produto {renderSortIcon('produto')}</div>
              </th>
              <th onClick={() => handleSort('marca')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group w-32">
                <div className="flex items-center">Marca {renderSortIcon('marca')}</div>
              </th>
              <th onClick={() => handleSort('loja')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                <div className="flex items-center">Loja {renderSortIcon('loja')}</div>
              </th>
              <th onClick={() => handleSort('preco_numerico')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group text-right">
                <div className="flex items-center justify-end">Preço {renderSortIcon('preco_numerico')}</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm md:text-base mb-1 group-hover:text-blue-700 transition-colors">
                      {item.produto}
                    </span>
                    {item.obs && (
                      <span className="text-xs text-slate-400 font-medium line-clamp-1">
                        {item.obs}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    <Tag size={10} />
                    {item.marca}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item.link ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                       <Store size={14} />
                       {item.loja}
                       <ExternalLink size={12} className="opacity-50" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Store size={14} />
                      {item.loja}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex flex-col items-end">
                    <span className="text-lg font-bold text-emerald-600 tracking-tight">
                      {item.preco_texto.split(' ')[0]} {item.preco_texto.includes('€') ? '€' : ''}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">
                      {item.preco_texto.split('/')[1] ? `por ${item.preco_texto.split('/')[1]}` : 'unidade'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
         <div className="p-12 text-center text-slate-500">
            <Search size={32} className="mx-auto mb-3 opacity-20" />
            <p>Nenhum resultado encontrado.</p>
         </div>
      )}
    </div>
  );

  const renderCompaniesTable = (data: CompanyItem[]) => (
    <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
       <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th onClick={() => handleSort('nome')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                <div className="flex items-center">Empresa / Profissional {renderSortIcon('nome')}</div>
              </th>
              <th onClick={() => handleSort('local')} className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group">
                <div className="flex items-center">Localização {renderSortIcon('local')}</div>
              </th>
              <th className="px-6 py-4">Contacto</th>
              <th className="px-6 py-4">Especialidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => {
              // Gerar iniciais para o avatar
              const initials = item.nome
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
              
              // Gerar cor aleatória consistente baseada no nome
              const colors = ['bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700', 'bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700', 'bg-orange-100 text-orange-700'];
              const colorClass = colors[item.nome.length % colors.length];

              return (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${colorClass} flex-shrink-0`}>
                        {initials}
                      </div>
                      <span className="font-semibold text-slate-900 text-sm md:text-base group-hover:text-blue-700 transition-colors">
                        {item.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <MapPin size={14} className="text-slate-400" />
                      {item.local}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a 
                      href={getContactLink(item.contacto)} 
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-all text-sm font-medium border border-slate-200 hover:border-blue-200"
                    >
                      {item.contacto.includes('@') ? <Mail size={14} /> : <Phone size={14} />}
                      {item.contacto}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                         {item.especialidade}
                      </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
       {data.length === 0 && (
         <div className="p-12 text-center text-slate-500">
            <Search size={32} className="mx-auto mb-3 opacity-20" />
            <p>Nenhum resultado encontrado.</p>
         </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header Strip */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 border border-blue-100">
                {message.dataType === 'materiais' ? <ShoppingCart size={24} /> : message.dataType === 'empresas' ? <Building2 size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {message.dataType === 'materiais' ? 'Comparativo de Preços' : message.dataType === 'empresas' ? 'Profissionais Recomendados' : 'Análise Técnica'}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  {message.dataType === 'materiais' ? 'Preços de referência em lojas nacionais' : message.dataType === 'empresas' ? 'Lista de contactos na sua zona' : 'Recomendações baseadas nas normas (RGEU)'}
                </p>
              </div>
            </div>

            {/* Filter Input for Structured Data */}
            {message.data && message.data.length > 0 && (
              <div className="relative w-full md:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder={message.dataType === 'materiais' ? "Filtrar produtos ou lojas..." : "Filtrar por nome ou local..."}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white sm:text-sm transition-all shadow-sm select-text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="prose prose-slate max-w-none">
            {message.content && (
                <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 prose-headings:font-bold prose-h3:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-900 prose-li:marker:text-blue-500">
                    <ReactMarkdown
                    components={{
                        ul: ({node, ...props}) => <ul className="space-y-2 my-4 list-none pl-0" {...props} />,
                        li: ({node, ...props}) => (
                        <li className="flex items-start gap-3 text-slate-700">
                            <CheckCircle2 className="mt-1 min-w-[18px] text-blue-500 flex-shrink-0" size={18} />
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
            <div className="mt-10 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Fontes Verificadas
              </h3>
              <div className="flex flex-wrap gap-3">
                {message.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group text-sm text-slate-600 hover:text-blue-700"
                  >
                    <span className="font-medium max-w-[200px] truncate">{source.title}</span>
                    <ExternalLink size={12} className="text-slate-300 group-hover:text-blue-500" />
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
