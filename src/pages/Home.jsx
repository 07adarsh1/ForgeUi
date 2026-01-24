import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import HistorySidebar from '../components/HistorySidebar'
import Select from 'react-select';
// Using only Io5 icons for consistency
import { IoSparkles, IoCodeSlash, IoClose, IoCopyOutline, IoDownloadOutline, IoOpenOutline, IoRefresh } from 'react-icons/io5';
import Editor from '@monaco-editor/react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'All Frameworks' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[1]); // Default to Tailwind
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [enhancing, setEnhancing] = useState(false);

  // 🕒 History State
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('genui_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('genui_history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (newPrompt, newCode, frameWorkVal) => {
    const newItem = {
      id: Date.now(),
      prompt: newPrompt,
      code: newCode,
      framework: frameWorkVal,
      date: new Date().toISOString()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
    toast.info("History cleared");
  };

  const loadHistoryItem = (item) => {
    setPrompt(item.prompt);
    setCode(item.code);
    const fw = options.find(o => o.value === item.framework) || options[1];
    setFrameWork(fw);
    setOutputScreen(true);
    setTab(2); // Preview tab
    setIsHistoryOpen(false);
    toast.success("Loaded from history");
  };

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const enhancePrompt = async () => {
    if (!prompt.trim()) return toast.info("Please enter a basic prompt first");

    try {
      setEnhancing(true);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const promptImprovement = `
        Act as a senior UI/UX Designer. Rewrite the following user prompt to be detailed, professional, and focused on modern, high-quality aesthetics (Glassmorphism, clean layout, good typography).
        User Prompt: "${prompt}"
        
        Return ONLY the refined prompt text, nothing else.
      `;

      const result = await model.generateContent(promptImprovement);
      const enhancedText = result.response.text().trim();
      setPrompt(enhancedText);
      toast.success("Prompt enhanced using AI ✨");
    } catch (error) {
      console.error(error);
      toast.error("Failed to enhance prompt");
    } finally {
      setEnhancing(false);
    }
  };

  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const promptText = `
      You are an expert frontend developer and UI/UX designer. You specialize in creating modern, minimalist, and highly aesthetic web components.
      
      **Task:** Generate a single, self-contained HTML file for the following component: "${prompt}"
      
      **Framework:** ${frameWork.value}
      
      **Requirements:**
      1. **Structure:** Return a COMPLETE HTML file (<!DOCTYPE html>...</html>).
      2. **Dependencies:**
         - ALWAYS include the **Tailwind CSS CDN** (<script src="https://cdn.tailwindcss.com"></script>) (if Tailwind selected or default).
         - Include **FontAwesome** (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">).
         - Include **Google Fonts** ('Inter', 'Outfit', or 'Playfair Display' based on context).
      3. **Design Standard:** 
         - Use "Glassmorphism" or "Neomorphism" where appropriate.
         - Soft shadows, generous padding, and rounded corners (rounded-xl, rounded-2xl).
         - Modern color palettes (slate, zinc, indigo, violet).
      4. **Responsiveness:** Fully mobile-responsive.
      5. **Output:** Return ONLY the raw code inside a markdown code block.
      `;

      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      const extractedCode = extractCode(text);
      setCode(extractedCode);
      addToHistory(prompt, extractedCode, frameWork.value);

      setOutputScreen(true);
      setTab(2);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!code.trim()) return;
    await navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
  };

  const downnloadFile = () => {
    if (!code.trim()) return;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "GenUI-Component.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded HTML");
  };

  // Custom Styles for React Select to match Minimalist Theme
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderColor: state.isFocused ? "rgba(255, 255, 255, 0.2)" : "transparent",
      padding: "8px",
      borderRadius: "12px",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#18181b", // zinc-900
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.1)",
      overflow: "hidden",
      padding: "4px"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "rgba(255,255,255,0.1)" : "transparent",
      color: state.isSelected ? "#fff" : "#a1a1aa",
      borderRadius: "8px",
      cursor: "pointer",
      "&:hover": { backgroundColor: "rgba(255,255,255,0.05)", color: "#fff" }
    }),
    singleValue: (base) => ({ ...base, color: "#fff", fontWeight: 500 }),
    placeholder: (base) => ({ ...base, color: "#71717a" }),
    input: (base) => ({ ...base, color: "#fff" })
  };

  return (
    <>
      <Navbar toggleHistory={() => setIsHistoryOpen(prev => !prev)} />

      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={loadHistoryItem}
        onClear={clearHistory}
      />

      <div className="min-h-[calc(100vh-80px)] px-6 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Section: Input Area */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Input Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col h-full shadow-2xl">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Create.
              </h2>
              <p className="text-gray-400 mt-2 font-light">
                Describe your vision. Tailwind & HTML generated instantly.
              </p>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Framework</label>
              <Select
                options={options}
                value={frameWork}
                styles={customSelectStyles}
                components={{ IndicatorSeparator: () => null }}
                onChange={(selected) => setFrameWork(selected)}
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Prompt</label>
                <button
                  onClick={enhancePrompt}
                  disabled={enhancing || !prompt.trim()}
                  className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enhancing ? <ClipLoader size={10} color="#c084fc" /> : <IoSparkles />}
                  {enhancing ? "Enhancing..." : "Enhance with AI"}
                </button>
              </div>
              <textarea
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                className="w-full flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:bg-white/10 focus:border-white/20 transition-all resize-none font-light leading-relaxed"
                placeholder="e.g. A minimalist pricing card with glassmorphism effect, dark mode, and a gradient button..."
              ></textarea>
            </div>

            <button
              onClick={getResponse}
              disabled={loading}
              className="mt-6 w-full py-4 rounded-xl font-medium text-black bg-white hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <ClipLoader color='#000' size={20} /> : <IoSparkles className="text-lg" />}
              {loading ? "Generating..." : "Generate Component"}
            </button>
          </div>
        </div>

        {/* Right Section: Output Area */}
        <div className="lg:col-span-7 h-[85vh] lg:h-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          {!outputScreen ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <IoCodeSlash className="text-3xl opacity-50" />
              </div>
              <p className="font-light">Your generated output will appear here.</p>
            </div>
          ) : (
            <>
              {/* Minimal Toolbar */}
              <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
                <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg">
                  <button
                    onClick={() => setTab(1)}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === 1 ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === 2 ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {tab === 1 && (
                    <>
                      <button onClick={copyCode} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Copy"><IoCopyOutline /></button>
                      <button onClick={downnloadFile} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Download"><IoDownloadOutline /></button>
                    </>
                  )}
                  {tab === 2 && (
                    <>
                      <button onClick={() => setRefreshKey(p => p + 1)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Refresh"><IoRefresh /></button>
                      <button onClick={() => setIsNewTabOpen(true)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Expand"><IoOpenOutline /></button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 relative">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    height="100%"
                    theme='vs-dark'
                    language="html"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 20 },
                      fontFamily: "'JetBrains Mono', monospace",
                      scrollBeyondLastLine: false,
                    }}
                  />
                ) : (
                  <iframe
                    key={refreshKey}
                    srcDoc={code}
                    className="w-full h-full bg-white"
                    title="preview"
                  ></iframe>
                )}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Minimal Fullscreen Modal */}
      {isNewTabOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
          <div className="h-16 flex items-center justify-between px-8 border-b border-white/10">
            <span className="text-white font-medium">Fullscreen Preview</span>
            <button onClick={() => setIsNewTabOpen(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
              <IoClose />
            </button>
          </div>
          <div className="flex-1 p-8">
            <iframe srcDoc={code} className="w-full h-full bg-white rounded-xl shadow-2xl"></iframe>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
