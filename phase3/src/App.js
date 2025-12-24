import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkles, FileText, ExternalLink, Cpu, Loader2, X, Eye } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';
const NODE_API_BASE = 'http://localhost:3000/api';

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const loadData = () => {
    setLoading(true);
    axios.get(`${API_BASE}/articles`)
      .then(res => { 
        const sorted = res.data.sort((a, b) => b.id - a.id);
        setArticles(sorted); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">BeyondChats AI CMS</h1>
          <p className="text-slate-500">Phase 2: Automated AI Style Transfer & Reference Sourcing</p>
        </header>

        {loading && articles.length === 0 ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onRefresh={loadData} 
                onView={() => setSelectedArticle(article)} 
              />
            ))}
          </div>
        )}
      </div>

      
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{selectedArticle.title}</h2>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-grow prose prose-slate max-w-none">
              <div 
                className="rendered-html-content whitespace-pre-wrap text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }} 
              />
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ArticleCard = ({ article, onRefresh, onView }) => {
  const [processing, setProcessing] = useState(false);
  
  
  const isAI = article.title.startsWith('[AI]');
  const isProcessed = article.is_processed === 1 || article.is_processed === true;

  const handleProcess = async (e) => {
    e.stopPropagation();
    if (isProcessed) return alert("This article has already been used to generate an AI version.");
    
    setProcessing(true);
    try {
      const res = await axios.post(`${NODE_API_BASE}/process-article/${article.id}`, {}, {
        timeout: 60000 
      });
      
      alert(" AI Processing Complete! A new styled version has been created.");
      onRefresh();
    } catch (err) {
      console.error("Processing Error:", err);
      const errorMsg = err.response?.data?.error || "Connection to Node.js server failed. Make sure it's running on port 3000.";
      alert(" Error: " + errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={`group bg-white rounded-2xl border transition-all hover:shadow-xl overflow-hidden flex flex-col h-full ${
      isAI ? 'border-indigo-400 ring-2 ring-indigo-50 shadow-md' : 'border-slate-200'
    }`}>
      <div className={`px-4 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest ${
        isAI ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'
      }`}>
        <span className="flex items-center gap-1">
            {isAI ? <Sparkles size={12} /> : <FileText size={12} />}
            {isAI ? 'AI Re-Styled Version' : 'Original Scraped Content'}
        </span>
        
        {/* Only show "Process" button on raw, unprocessed articles */}
        {!isAI && !isProcessed && (
          <button 
            onClick={handleProcess} 
            disabled={processing}
            className="bg-white/20 hover:bg-white/40 px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50 transition-all border border-white/30"
          >
            {processing ? <Loader2 size={10} className="animate-spin" /> : <Cpu size={10} />}
            {processing ? 'Processing...' : 'Run AI Transfer'}
          </button>
        )}

        {isProcessed && !isAI && (
          <span className="opacity-60 italic">Already Processed</span>
        )}
      </div>

      <div className="p-6 flex-grow">
        <h3 className={`text-xl font-bold mb-3 line-clamp-2 ${isAI ? 'text-indigo-900' : 'text-slate-800'}`}>
          {article.title}
        </h3>
        
        <div 
          className="text-slate-500 text-sm line-clamp-3 mb-4 pointer-events-none"
          dangerouslySetInnerHTML={{ __html: article.content.substring(0, 160) + '...' }}
        />
        
        <button 
          onClick={onView}
          className={`flex items-center gap-2 font-bold text-sm transition-colors ${
            isAI ? 'text-indigo-600 hover:text-indigo-800' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye size={16} /> View Content
        </button>
      </div>

      {article.source_url && (
        <div className="px-6 py-3 bg-slate-50 border-t flex justify-between items-center">
            <a href={article.source_url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                <ExternalLink size={12} /> {isAI ? 'Reference Source' : 'Original Source'}
            </a>
            <span className="text-[10px] text-slate-300 font-mono">DB_ID: {article.id}</span>
        </div>
      )}
    </div>
  );
};

export default App;