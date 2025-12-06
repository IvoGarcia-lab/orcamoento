import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink, CheckCircle2, Building2, Search, ArrowUpDown, ArrowUp, ArrowDown, FileText, Phone, Mail, MapPin, Store, Tag, FileDown } from 'lucide-react';
import { Message, MaterialItem, CompanyItem } from '../types';

interface ResultCardProps {
  message: Message;
}

const ResultCard: React.FC<ResultCardProps> = ({ message }) => {
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sortedAndFilteredData = useMemo(() => {
    if (!message.data) return [];
    let data = [...message.data];
    if (filterText) {
      const lowerFilter = filterText.toLowerCase();
      data = data.filter((item: any) => 
        Object.values(item).some((val) => 
          String(val).toLowerCase().includes(lowerFilter)
        )
      );
    }
    if (sortConfig) {
      data.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [message.data, filterText, sortConfig]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig?.key !== key) return <ArrowUpDown size={12} className="ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={12} className="ml-1 text-slate-900 dark:text-white" />
      : <ArrowDown size={12} className="ml-1 text-slate-900 dark:text-white" />;
  };

  const handlePrint = () => {
    window.print();
  };

  const renderMaterialsTable = (data: MaterialItem[]) => (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm print:border-slate-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-mono print:bg-slate-100 print:text-black">
              <th onClick={() => handleSort('produto')} className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 group font-normal">
                <div className="flex items-center">Item {renderSortIcon('produto')}</div>
              </th>
              <th onClick={() => handleSort('marca')} className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 group w-32 font-normal">
                <div className="flex items-center">Marca {renderSortIcon('marca')}</div>
              </th>
              <th onClick={() => handleSort('loja')} className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 group font-normal">
                <div className="flex items-center">Fornecedor {renderSortIcon('loja')}</div>
              </th>
              <th onClick={() => handleSort('preco_numerico')} className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 group text-right font-normal">
                <div className="flex items-center justify-end">Custo Unit. {renderSortIcon('preco_numerico')}</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group print:break-inside-avoid">
                <td className="px-6 py-3 align-top">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white print:text-black">{item.produto}</span>
                    {item.obs && <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 print:text-slate-600">{item.obs}</span>}
                  </div>
                </td>
                <td className="px-6 py-3 align-top">
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 print:bg-white print:border-slate-400 print:text-black">{item.marca}</span>
                </td>
                <td className="px-6 py-3 align-top">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-1 underline-offset-2 dark:text-slate-300 print:text-black print:no-underline">
                       {item.loja} <ExternalLink size={10} className="opacity-50 no-print" />
                    </a>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-300 print:text-black">{item.loja}</span>
                  )}
                </td>
                <td className="px-6 py-3 text-right align-top">
                  <div className="font-mono font-medium text-slate-900 dark:text-white print:text-black">
                    {item.preco_numerico.toFixed(2)} €
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide print:text-slate-600">
                    {item.preco_texto.split('/')[1] || 'un'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompaniesTable = (data: CompanyItem[]) => (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm print:border-slate-300">
       <div className="w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest font-mono print:bg-slate-100 print:text-black">
              <th onClick={() => handleSort('nome')} className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 group font-normal">
                <div className="flex items-center">Entidade {renderSortIcon('nome')}</div>
              </th>
              <th onClick={() => handleSort('local')} className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 group font-normal">
                <div className="flex items-center">Zona {renderSortIcon('local')}</div>
              </th>
              <th className="px-6 py-3 font-normal">Contacto</th>
              <th className="px-6 py-3 font-normal">Especialidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors print:break-inside-avoid">
                <td className="px-6 py-3 font-medium text-slate-900 dark:text-white print:text-black">{item.nome}</td>
                <td className="px-6 py-3 text-slate-600 dark:text-slate-400 font-mono text-xs print:text-black">{item.local}</td>
                <td className="px-6 py-3">
                  <a href={`tel:${item.contacto.replace(/[^\d+]/g, '')}`} className="font-mono text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border-b border-dotted border-slate-400 hover:border-blue-600 print:text-black print:border-none print:no-underline">
                    {item.contacto}
                  </a>
                </td>
                <td className="px-6 py-3">
                  <span className="inline-block px-2 py-0.5 border border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 print:border-slate-400 print:text-black">
                     {item.especialidade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto my-12 print:my-0">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm p-8 relative print:border-none print:shadow-none print:p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 dark:bg-white print:bg-black"></div>
        <div className="absolute top-4 right-4 text-slate-200 dark:text-slate-800 print:hidden">
          <FileText size={48} strokeWidth={0.5} />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6 print:border-black print:mb-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 print:text-black">Relatório Técnico Gerado por IA</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight print:text-black">
              {message.dataType === 'materiais' ? 'Mapa de Quantidades & Custos' : message.dataType === 'empresas' ? 'Registo de Entidades' : 'Parecer Técnico'}
            </h2>
          </div>

          <div className="flex gap-4 items-end no-print">
            {message.data && message.data.length > 0 && (
                <div className="relative w-full md:w-64">
                <input
                    type="text"
                    placeholder="FILTRAR DADOS..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-0 py-2 text-sm font-mono focus:outline-none focus:border-slate-900 dark:focus:border-white placeholder-slate-400 dark:placeholder-slate-600 uppercase tracking-wide dark:text-white"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
                <Search className="absolute right-0 top-2 text-slate-400 dark:text-slate-600" size={14} />
                </div>
            )}
            <button 
                onClick={handlePrint}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Exportar PDF"
            >
                <FileDown size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:font-light prose-headings:font-semibold prose-strong:font-medium prose-strong:text-slate-900 dark:prose-strong:text-white print:prose-p:text-black print:prose-strong:text-black">
          {message.content && (
              <div className="mb-8 font-sans leading-relaxed text-slate-700 dark:text-slate-300 print:text-black">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
          )}

          {message.dataType === 'materiais' && message.data && renderMaterialsTable(sortedAndFilteredData as MaterialItem[])}
          {message.dataType === 'empresas' && message.data && renderCompaniesTable(sortedAndFilteredData as CompanyItem[])}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-6 gap-y-2 print:border-black">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 self-center print:text-black">Referências:</span>
            {message.sources.map((source, idx) => (
              <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:underline decoration-1 underline-offset-2 flex items-center gap-1 print:text-black print:no-underline">
                [{idx + 1}] {source.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;