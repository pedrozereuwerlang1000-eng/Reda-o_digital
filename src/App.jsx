import React, { useState, useEffect, useRef } from 'react';
import { Printer, Edit3, Trash2, Type, PenTool, Download, AlertCircle, CheckCircle2, MousePointer2 } from 'lucide-react';

const App = () => {
  const initialText = `   É notável que o cinema brasileiro enfrenta desafios profundos que impedem sua plena consolidação como pilar da identidade nacional. Nesse contexto, é precípuo analisar esse cenário sob uma ótica mais abrangente, a qual compreenda tanto a camuflagem cultural quanto a escassez de investimentos no setor.
   Em primeira análise, o Brasil enfrenta um histórico apagamento de sua autenticidade artística. Sob esse viés, pode-se utilizar o período da Ditadura Militar como exemplo, época em que a censura e a importação de modelos estéticos dos Estados Unidos fragilizaram a produção local. Dessa forma, criou-se um hábito de consumo voltado ao estrangeiro, o que dificulta, ainda hoje, a aceitação de narrativas genuinamente tupiniquins pelo próprio público brasileiro.
   Ademais, a negligência estatal e a falta de investimentos reforçarão a elitização do acesso à arte. Conforme o geógrafo Milton Santos, o Brasil convive com "cidadanias mutiladas", nas quais os direitos fundamentais não atingem toda a população. Nesse sentido, a escassez de estímulo público resulta na concentração de salas de exibição em centros urbanos desenvolvidos, excluindo as periferias e o interior do país. Consequentemente, o cinema deixa de exercer seu papel social de integração para tornar-se um produto de consumo restrito, silenciando as narrativas de grande parte do corpo social.
   Portanto, cabe ao Governo brasileiro por meio do Ministério da Cultura ampliar as políticas de fomento ao setor audiovisual, obrigando a exibição de filmes nacionais em horários competitivos, com o objetivo de democratizar o acesso e fortalecer a produção interna. Somente assim o Brasil deixará de ser um espectador da cultura alheia e se tornará protagonista de sua própria história.`;

  const [title, setTitle] = useState("O Cinema Brasileiro e os Seus Desafios");
  const [text, setText] = useState(initialText);
  const [fontStyle, setFontStyle] = useState('cursiva'); 
  const [lines, setLines] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfContainerRef = useRef(null);
  const MAX_LINES = 30;

  useEffect(() => {
    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const paragraphs = text.split('\n');
    let allLines = [];
    
    // Limites de caracteres para evitar corte lateral e garantir preenchimento
    let charsPerLine = 72;
    if (fontStyle === 'cursiva') charsPerLine = 62; 
    if (fontStyle === 'bastao') charsPerLine = 58;  
    if (fontStyle === 'digitada') charsPerLine = 84;

    paragraphs.forEach(p => {
      if (p.trim() === "" && allLines.length > 0) return;
      
      const words = p.split(' ');
      let currentLine = "";
      
      words.forEach(word => {
        const space = currentLine === "" ? "" : " ";
        if (currentLine !== "" && (currentLine + space + word).length > charsPerLine) {
          allLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine += space + word;
        }
      });
      allLines.push(currentLine);
    });
    setLines(allLines.slice(0, MAX_LINES));
  }, [text, fontStyle]);

  const handleDownloadPDF = async () => {
    if (typeof window.html2pdf === 'undefined') return;
    setIsGenerating(true);
    const element = pdfContainerRef.current;
    const opt = {
      margin: 0,
      filename: 'Redacao_Final_30_Linhas.pdf',
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        letterRendering: true, 
        scrollY: 0, 
        scrollX: 0,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await window.html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 font-sans text-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Kalam:wght@400;700&family=Inter:wght@400;700;900&display=swap');

        .a4-page {
          width: 210mm;
          height: 297mm;
          background: white;
          padding: 10mm 0; /* Reduzido para dar espaço às 30 linhas */
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .paper-line {
          border-bottom: 1px solid #a5c2f1;
          height: 8.2mm; /* Altura calculada para 30 linhas caberem perfeitamente */
          display: flex;
          align-items: flex-end;
          position: relative;
          padding-bottom: 0.5mm;
          box-sizing: border-box;
        }

        .margin-red-left {
          position: absolute;
          left: 50px;
          top: 0;
          bottom: 0;
          width: 1.5px;
          background-color: #ff8a8a;
          z-index: 10;
        }

        /* Estilos de Letra em Preto e Alinhados */
        .font-cursiva {
          font-family: 'Dancing Script', cursive;
          font-size: 1.75rem;
          color: #000000;
          line-height: 0.9;
          padding-left: 15px;
          white-space: pre;
          width: 100%;
          display: block;
        }

        .font-bastao {
          font-family: 'Kalam', cursive;
          font-size: 1.35rem;
          color: #000000;
          line-height: 1;
          padding-left: 15px;
          white-space: pre;
          width: 100%;
          display: block;
        }

        .font-digitada {
          font-family: 'Georgia', serif;
          font-size: 1.1rem;
          color: #000000;
          line-height: 1.1;
          padding-left: 14px;
          white-space: pre;
          width: 100%;
          display: block;
        }

        .line-num {
          width: 50px;
          font-size: 0.7rem;
          color: #94a3b8;
          text-align: center;
          font-weight: 700;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #e2e8f0;
          background-color: #fcfcfc;
          font-family: 'Inter', sans-serif;
          flex-shrink: 0;
        }

        .lines-container {
          border: 1px solid #cbd5e1;
          margin: 0 35px;
          background: white;
          flex-grow: 0;
        }

        .text-wrapper {
          flex: 1;
          overflow: visible;
        }

        @media print {
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        <div className="no-print space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200">
            <h2 className="text-xl font-black text-blue-600 mb-6 flex items-center gap-2 uppercase tracking-tight">
              <Edit3 size={20} /> Ajuste de 30 Linhas
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Tipo de Letra</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button onClick={() => setFontStyle('cursiva')} className={`py-2 rounded-xl text-[10px] font-black transition-all flex flex-col items-center gap-1 ${fontStyle === 'cursiva' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}><PenTool size={14} /> CURSIVA</button>
                  <button onClick={() => setFontStyle('bastao')} className={`py-2 rounded-xl text-[10px] font-black transition-all flex flex-col items-center gap-1 ${fontStyle === 'bastao' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}><Type size={14} /> BASTÃO</button>
                  <button onClick={() => setFontStyle('digitada')} className={`py-2 rounded-xl text-[10px] font-black transition-all flex flex-col items-center gap-1 ${fontStyle === 'digitada' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}><MousePointer2 size={14} /> DIGITADA</button>
                </div>
              </div>

              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-400 focus:outline-none font-bold text-lg" placeholder="Título" />
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-400 focus:outline-none font-serif text-lg leading-relaxed shadow-inner" />

              <button onClick={handleDownloadPDF} disabled={isGenerating} className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-5 rounded-2xl transition-all font-black text-lg shadow-lg uppercase">
                {isGenerating ? "Gerando Folha Completa..." : "Baixar PDF (30 Linhas)"}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 flex gap-4">
            <div className="bg-blue-600 text-white p-2 rounded-xl h-fit"><CheckCircle2 size={20} /></div>
            <div className="text-[12px] text-blue-900">
              <p className="font-bold mb-1 tracking-tight uppercase">Correção de Escala:</p>
              <p className="opacity-80">A altura das linhas foi ajustada para exatamente 8.2mm, garantindo que todas as 30 linhas apareçam em uma única página A4. A cor da fonte agora é preto puro para máxima legibilidade.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center bg-slate-300 p-6 rounded-[40px] shadow-inner overflow-hidden border-2 border-slate-400">
          <div className="pdf-wrapper transform origin-top scale-[0.45] sm:scale-[0.6] xl:scale-[0.75] 2xl:scale-100 transition-transform duration-300">
            <div ref={pdfContainerRef} className="a4-page shadow-2xl">
              <div className="pt-6 pb-4 px-20 text-center">
                <div className="border-b-2 border-slate-800 pb-2 inline-block min-w-[75%] font-black text-2xl uppercase tracking-widest text-slate-900 leading-tight">{title || "Título"}</div>
              </div>
              <div className="flex-1 relative flex flex-col items-center">
                <div className="lines-container relative bg-white w-[100%]">
                  <div className="margin-red-left"></div>
                  {[...Array(MAX_LINES)].map((_, i) => (
                    <div key={i} className="paper-line">
                      <div className="line-num">{i + 1}</div>
                      <div className={`text-wrapper font-${fontStyle}`}>
                        {lines[i] || ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-6 bg-white"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
