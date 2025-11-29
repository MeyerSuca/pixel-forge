import React, { useState, useCallback } from 'react';
import { generatePixelSprite } from './services/geminiService';
import { GeneratedImage, GeneratorState } from './types';
import { Gallery } from './components/Gallery';
import { Sparkles, Wand2, Loader2, AlertCircle, Terminal, Layers } from 'lucide-react';

const INITIAL_PROMPT = "A 64x64 pixel art sprite of a white Silkie chicken, side view, cute, fluffy texture like cotton, dark beak and face, light blue background, game asset style, crisp pixel edges.";

export default function App() {
  const [prompt, setPrompt] = useState(INITIAL_PROMPT);
  const [state, setState] = useState<GeneratorState>(GeneratorState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setState(GeneratorState.LOADING);
    setError(null);

    try {
      const base64Image = await generatePixelSprite(prompt);
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: base64Image,
        prompt: prompt,
        timestamp: Date.now(),
        width: 1024, // Model default
        height: 1024
      };

      setHistory(prev => [newImage, ...prev]);
      setState(GeneratorState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image");
      setState(GeneratorState.ERROR);
    }
  };

  const handleDelete = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Layers className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              PixelForge <span className="font-mono text-primary text-sm bg-primary/10 px-2 py-0.5 rounded border border-primary/20">AI</span>
            </h1>
          </div>
          <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
             Powered by Gemini <Sparkles size={14} className="text-yellow-400" />
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* Generator Section */}
        <section className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Input Side */}
              <div className="flex-1 w-full space-y-6">
                <div>
                   <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                     <Terminal className="text-primary" /> Command Center
                   </h2>
                   <p className="text-slate-400">Describe your sprite in detail. Include view, style, and colors.</p>
                </div>

                <form onSubmit={handleGenerate} className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono text-sm leading-relaxed resize-none"
                      placeholder="e.g. A fantasy sword with a glowing blue blade, pixel art style..."
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-slate-600 font-mono pointer-events-none">
                      {prompt.length} chars
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                     <button
                        type="submit"
                        disabled={state === GeneratorState.LOADING || !prompt.trim()}
                        className={`flex-1 py-3 px-6 rounded-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2
                          ${state === GeneratorState.LOADING 
                            ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                            : 'bg-gradient-to-r from-primary to-indigo-600 hover:shadow-indigo-500/30'
                          }`}
                     >
                       {state === GeneratorState.LOADING ? (
                         <>
                           <Loader2 className="animate-spin" size={20} /> Generating...
                         </>
                       ) : (
                         <>
                           <Wand2 size={20} /> Generate Sprite
                         </>
                       )}
                     </button>
                     
                     <button 
                       type="button" 
                       onClick={() => setPrompt(INITIAL_PROMPT)}
                       className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-lg font-medium transition-colors border border-slate-700 hover:border-slate-600 text-sm"
                     >
                       Reset Prompt
                     </button>
                  </div>
                </form>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-start gap-3 text-sm animate-fade-in">
                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {/* Preview Side (Last Generated) */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                 <div className="bg-slate-950/50 rounded-xl border-2 border-dashed border-slate-800 aspect-square flex items-center justify-center overflow-hidden relative">
                    {state === GeneratorState.LOADING ? (
                      <div className="flex flex-col items-center gap-3 text-slate-500 animate-pulse">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg"></div>
                        <span className="text-sm font-mono">Forging Pixels...</span>
                      </div>
                    ) : history.length > 0 ? (
                      <img 
                        src={history[0].url} 
                        alt="Preview" 
                        className="w-full h-full object-contain image-pixelated"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className="text-center p-6 text-slate-600">
                        <div className="w-16 h-16 bg-slate-900/80 rounded-lg mx-auto mb-3 flex items-center justify-center border border-slate-800">
                          <Layers className="opacity-50" />
                        </div>
                        <p className="text-sm">Preview will appear here</p>
                      </div>
                    )}
                 </div>
                 {history.length > 0 && (
                   <div className="text-center">
                      <p className="text-xs text-slate-500 font-mono mb-1">Latest Output</p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <Gallery images={history} onDelete={handleDelete} />
      </main>
    </div>
  );
}