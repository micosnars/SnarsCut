import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from './services/removeBgService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { CanvasEditor } from './components/CanvasEditor';
import { LandingHero } from './components/LandingHero';
import { ComparisonSlider } from './components/ComparisonSlider';
import { AdvancedColorPicker } from './components/AdvancedColorPicker';
import { ProcessingState, EditorState, AppStep } from './types';

export default function App() {
  // --- STATE ---
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  
  const [processingState, setProcessingState] = useState<ProcessingState>({
    originalFile: null,
    processedImageSrc: null,
    originalImageSrc: null,
    isProcessing: false,
    error: null,
  });

  // Editor State
  const [editorState, setEditorState] = useState<EditorState>({
    mode: 'transparent',
    backgroundColor: '#ffffff',
    backgroundImageSrc: null,
    scale: 1,
  });

  // Undo/Redo History
  const [history, setHistory] = useState<EditorState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDownloading, setIsDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- ACTIONS ---

  // Initialize History on Editor Mount
  useEffect(() => {
    if (step === AppStep.EDITOR && history.length === 0) {
      const initialState = { ...editorState };
      setHistory([initialState]);
      setHistoryIndex(0);
    }
  }, [step]);

  const updateEditorState = (newState: Partial<EditorState>) => {
    const updated = { ...editorState, ...newState };
    setEditorState(updated);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setEditorState(history[prevIndex]);
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setEditorState(history[nextIndex]);
      setHistoryIndex(nextIndex);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const originalUrl = URL.createObjectURL(file);
      
      setProcessingState({
        originalFile: file,
        originalImageSrc: originalUrl,
        processedImageSrc: null,
        isProcessing: true,
        error: null,
      });

      setStep(AppStep.PROCESSING);

      try {
        const bgBlob = await removeBackground(file);
        const url = URL.createObjectURL(bgBlob);
        setProcessingState(prev => ({
          ...prev,
          processedImageSrc: url,
          isProcessing: false,
        }));
        setStep(AppStep.COMPARISON);
      } catch (error: any) {
        setProcessingState(prev => ({
          ...prev,
          isProcessing: false,
          error: error.message || "Failed to process image",
        }));
        setStep(AppStep.LANDING); // Go back on error
      }
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      updateEditorState({
        mode: 'image',
        backgroundImageSrc: url
      });
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      setIsDownloading(true);
      
      // UX Delay to show feedback
      setTimeout(() => {
        if (canvasRef.current) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const link = document.createElement('a');
          link.download = `SnarsCut-Result-${timestamp}.png`;
          link.href = canvasRef.current.toDataURL('image/png', 1.0);
          link.click();
        }
        setIsDownloading(false);
      }, 1000);
    }
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen font-sans relative z-10 flex flex-col">
      
      {/* Top Nav (only visible if not on Landing) */}
      {step !== AppStep.LANDING && (
        <header className="w-full p-4 lg:p-6 flex justify-between items-center z-50">
           <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.reload()}>
            <div className="w-6 h-6 rounded bg-neon-cyan shadow-[0_0_10px_#00FFFF]"></div>
            <h1 className="text-xl font-bold text-white tracking-wide">SnarsCut</h1>
          </div>
        </header>
      )}

      <main className="container mx-auto flex-1 flex flex-col">
        
        {/* VIEW 1: LANDING */}
        {step === AppStep.LANDING && (
          <LandingHero onUpload={handleFileUpload} />
        )}

        {/* VIEW 2: PROCESSING */}
        {step === AppStep.PROCESSING && (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner text="AI is analyzing pixels..." size="lg" />
          </div>
        )}

        {/* VIEW 3: COMPARISON */}
        {step === AppStep.COMPARISON && processingState.processedImageSrc && processingState.originalImageSrc && (
          <div className="flex-1 flex flex-col pt-4 pb-10 px-4">
             <ComparisonSlider 
               originalImageSrc={processingState.originalImageSrc}
               processedImageSrc={processingState.processedImageSrc}
               onContinue={() => setStep(AppStep.EDITOR)}
             />
          </div>
        )}

        {/* VIEW 4: EDITOR - UNIFIED WORKSTATION LAYOUT */}
        {step === AppStep.EDITOR && processingState.processedImageSrc && (
          <div className="flex-1 flex flex-col pt-2 pb-8 px-4 lg:h-[85vh]">
            
            <div className="flex-1 w-full max-w-7xl mx-auto glass-panel rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-white/10">
              
              {/* Left Panel: Canvas Workspace */}
              <div className="flex-1 bg-black/20 p-4 lg:p-6 flex flex-col relative overflow-hidden">
                
                {/* Canvas Toolbar */}
                <div className="flex justify-between items-center mb-4 z-10">
                   <div className="flex gap-2">
                      <button 
                        onClick={handleUndo} 
                        disabled={historyIndex <= 0}
                        className="p-2 rounded-lg hover:bg-white/10 text-white disabled:opacity-30 transition-colors border border-transparent hover:border-white/5"
                        title="Undo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                      </button>
                      <button 
                        onClick={handleRedo}
                        disabled={historyIndex >= history.length - 1}
                        className="p-2 rounded-lg hover:bg-white/10 text-white disabled:opacity-30 transition-colors border border-transparent hover:border-white/5"
                        title="Redo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                        </svg>
                      </button>
                   </div>
                   <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-semibold bg-black/40 px-3 py-1 rounded-full border border-white/5">
                      Canvas Preview
                   </div>
                </div>
                
                {/* Actual Canvas */}
                <div className="flex-1 flex items-center justify-center rounded-xl overflow-hidden border border-white/5 relative">
                  {/* The background pattern is handled inside CanvasEditor for conditional logic */}
                  <CanvasEditor 
                    processedImageSrc={processingState.processedImageSrc}
                    editorState={editorState}
                    onCanvasReady={(canvas) => { canvasRef.current = canvas; }}
                  />
                </div>
              </div>

              {/* Right Panel: Controls & Actions */}
              <div className="w-full lg:w-96 bg-neon-surface/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col z-20">
                 
                 {/* Scrollable Controls Area */}
                 <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    <div className="space-y-4">
                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Background Mode</h3>
                       
                       <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                          <button 
                            onClick={() => updateEditorState({ mode: 'transparent' })}
                            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${editorState.mode === 'transparent' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            None
                          </button>
                          <button 
                            onClick={() => updateEditorState({ mode: 'color' })}
                            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${editorState.mode === 'color' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            Color
                          </button>
                          <button 
                            onClick={() => updateEditorState({ mode: 'image' })}
                            className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${editorState.mode === 'image' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            Image
                          </button>
                       </div>
                    </div>

                    {/* Dynamic Tool Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                      {editorState.mode === 'color' && (
                        <AdvancedColorPicker 
                          color={editorState.backgroundColor}
                          onChange={(c) => updateEditorState({ backgroundColor: c })}
                        />
                      )}

                      {editorState.mode === 'image' && (
                        <div className="space-y-3">
                           <div className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center bg-white/5 overflow-hidden relative group hover:border-neon-cyan/50 transition-colors">
                              {editorState.backgroundImageSrc ? (
                                <img src={editorState.backgroundImageSrc} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="bg" />
                              ) : (
                                <div className="text-center p-4">
                                  <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span className="text-xs text-gray-500">No Image Selected</span>
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="px-3 py-1.5 bg-black/60 rounded-full text-xs text-white backdrop-blur-sm border border-white/10">Click to Upload</span>
                              </div>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleBgImageUpload}
                              />
                           </div>
                           <p className="text-[10px] text-gray-500 text-center">Supports high-res JPG/PNG</p>
                        </div>
                      )}
                      
                      {editorState.mode === 'transparent' && (
                        <div className="text-center py-10 px-4 rounded-xl border border-white/5 bg-white/5">
                           <svg className="w-10 h-10 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                           </svg>
                          <p className="text-gray-400 text-sm">Subject will be saved on a clear transparent background.</p>
                        </div>
                      )}
                    </div>
                 </div>

                 {/* Sticky Footer Area for Actions */}
                 <div className="p-6 border-t border-white/10 bg-black/20 flex flex-col sm:flex-row gap-3">
                    <button 
                       onClick={() => {
                         setStep(AppStep.LANDING);
                         setHistory([]);
                       }}
                       className="flex-1 py-3.5 px-4 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/5 hover:border-white/40 transition-all text-center"
                    >
                      Start Over
                    </button>
                    
                    <button 
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="flex-[2] py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-black font-bold text-sm shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(189,0,255,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                       {isDownloading ? (
                          <>
                             <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             <span>Downloading...</span>
                          </>
                       ) : (
                          <span>Download HD</span>
                       )}
                    </button>
                 </div>

              </div>

            </div>
          </div>
        )}

      </main>

      <footer className="w-full p-6 text-center z-50 pointer-events-none">
        <p className="text-xs text-gray-500 font-medium tracking-wide">
          Powered by SnarsCut AI © 2025
        </p>
      </footer>
    </div>
  );
}