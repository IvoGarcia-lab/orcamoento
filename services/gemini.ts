import { GoogleGenAI } from "@google/genai";
import { SearchResult, SearchCategory } from "../types";

const getSystemInstruction = (category: SearchCategory) => {
  const baseInstruction = `Você é um consultor sênior de construção civil em Portugal.`;

  if (category === 'materiais') {
    return `${baseInstruction}
    OBJETIVO: PESQUISAR PREÇOS REAIS EM PORTUGAL E RETORNAR APENAS JSON.
    
    1. Use o Google Search para encontrar preços atuais (Leroy Merlin, Maxmat, Brico Depôt, etc).
    2. O SEU OUTPUT DEVE SER ESTRITAMENTE UM ARRAY JSON VÁLIDO.
    3. NÃO inclua texto introdutório, nem formatação Markdown (\`\`\`json). Apenas o JSON cru.
    
    ESQUEMA DO JSON (Array de Objetos):
    [
      {
        "produto": "Nome detalhado do material com medidas",
        "marca": "Marca do produto (ou Genérica)",
        "preco_numerico": 12.50 (tipo number, use ponto decimal),
        "preco_texto": "12,50 €/un (tipo string, com moeda)",
        "loja": "Nome da loja",
        "link": "URL direto para a página do produto (se disponível)",
        "obs": "Notas breves"
      }
    ]
    
    Se não encontrar preço exato, estime com base em similares mas indique nas 'obs'. Tente sempre incluir o link.`;
  }

  if (category === 'empresas') {
    return `${baseInstruction}
    OBJETIVO: PESQUISAR EMPRESAS REAIS EM PORTUGAL E RETORNAR APENAS JSON.
    IMPORTANTE: SEJA ABRANGENTE. TENTE ENCONTRAR ENTRE 10 A 15 EMPRESAS/PROFISSIONAIS RELEVANTES.
    
    1. Use o Google Search para encontrar empresas ativas na zona solicitada.
    2. O SEU OUTPUT DEVE SER ESTRITAMENTE UM ARRAY JSON VÁLIDO.
    3. NÃO inclua texto introdutório, nem formatação Markdown (\`\`\`json). Apenas o JSON cru.
    
    ESQUEMA DO JSON (Array de Objetos):
    [
      {
        "nome": "Nome da Empresa",
        "local": "Cidade ou Concelho",
        "contacto": "Telefone ou Email",
        "especialidade": "Principal área de atuação"
      }
    ]
    `;
  }

  // Soluções (Texto livre)
  return `${baseInstruction}
  Responda em Markdown limpo e organizado.
  Foque em normas técnicas portuguesas (RGEU).
  Use listas e negritos para facilitar a leitura.`;
};

export const getConstructionAdvice = async (query: string, category: SearchCategory): Promise<SearchResult> => {
  try {
    // Lazy initialization: Check key availability inside the function call.
    // This allows the app to load UI even if env vars are missing on the VPS initially.
    // UPDATE: Using GEMINI_API_KEY as per configuration
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error("A chave GEMINI_API_KEY não foi encontrada. Verifique as Variáveis de Ambiente no seu servidor (Coolify/Hostinger).");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const model = 'gemini-2.5-flash';
    
    // NOTA: Removemos responseMimeType e responseSchema da configuração
    // porque atualmente são incompatíveis com tools: [{ googleSearch: {} }]
    
    const apiCall = ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction: getSystemInstruction(category),
        tools: [{ googleSearch: {} }],
        temperature: 0.3,
      },
    });

    // Timeout race to prevent hanging - Increased to 60s for comprehensive searches
    const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("A pesquisa excedeu o tempo limite (60s). Tente ser mais específico.")), 60000)
    );

    const response = await Promise.race([apiCall, timeoutPromise]) as any;

    if (!response || !response.text) {
         throw new Error("Resposta vazia da IA.");
    }

    let structuredData;
    let textResult = response.text;

    // Manual JSON Parsing logic
    if (category === 'materiais' || category === 'empresas') {
      try {
        // Limpar possíveis formatações markdown que o modelo possa adicionar
        let cleanText = response.text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
        
        // Tentar encontrar o array JSON se houver texto à volta
        const firstBracket = cleanText.indexOf('[');
        const lastBracket = cleanText.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket !== -1) {
            cleanText = cleanText.substring(firstBracket, lastBracket + 1);
        }

        structuredData = JSON.parse(cleanText);
        textResult = ""; // Se tivermos dados estruturados, limpamos o texto para evitar duplicação na UI
      } catch (e) {
        console.error("Erro ao fazer parse do JSON manual:", e);
        console.log("Texto recebido:", response.text);
        // Fallback: mantemos o textResult original, a UI vai renderizar como markdown (provavelmente a tabela quebrada ou texto)
        textResult = response.text; 
      }
    }

    return {
      text: textResult,
      structuredData: structuredData,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };

  } catch (error) {
    console.error("Gemini Service Error:", error);
    return {
      text: `### Erro na Pesquisa\n\n${(error as any).message || 'Ocorreu um erro inesperado.'}\n\nSe estiver a configurar no Hostinger/Coolify, certifique-se que a variável **GEMINI_API_KEY** está definida nas configurações.`,
      groundingMetadata: undefined
    };
  }
};