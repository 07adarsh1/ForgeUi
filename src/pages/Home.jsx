import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import HistorySidebar from '../components/HistorySidebar'
import Select from 'react-select';
// Using only Io5 icons for consistency
import {
  IoSparkles, IoCodeSlash, IoClose, IoCopyOutline, IoDownloadOutline,
  IoOpenOutline, IoRefresh, IoSpeedometer, IoAccessibility,
  IoMoon, IoScan, IoGitCompare
} from 'react-icons/io5';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Groq from "groq-sdk";

const Home = () => {

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'react-tailwind', label: 'React + Tailwind' },
    { value: 'html-tailwind-bootstrap', label: 'All Frameworks' },
  ];

  const aiOptions = [
    { value: 'gemini', label: 'Gemini 2.5 Flash' },
    { value: 'groq', label: 'Groq (Llama 3)' }
  ];

  // Global State
  const [mode, setMode] = useState('create'); // 'create' | 'improve'
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 'Create' Mode State
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[1]);
  const [modelProvider, setModelProvider] = useState(aiOptions[0]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [enhancing, setEnhancing] = useState(false);

  // 'Improve' Mode State
  const [inputCode, setInputCode] = useState("");
  const [improvedCode, setImprovedCode] = useState("");

  const [improveTab, setImproveTab] = useState('diff'); // 'diff' | 'code' | 'preview'
  const [customImprovePrompt, setCustomImprovePrompt] = useState("");

  // 🕒 History State
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('forgeui_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('forgeui_history', JSON.stringify(history));
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
    setGeneratedCode(item.code);
    const fw = options.find(o => o.value === item.framework) || options[1];
    setFrameWork(fw);
    setMode('create');
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
  const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

  async function generateWithAI(promptText) {
    if (modelProvider.value === 'gemini') {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(promptText);
      return result.response.text();
    } else {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: promptText }],
        model: "llama-3.3-70b-versatile",
      });
      return completion.choices[0]?.message?.content || "";
    }
  }

  // --- Create Mode Logic ---

  const enhancePrompt = async () => {
    if (!prompt.trim()) return toast.info("Please enter a basic prompt first");

    try {
      setEnhancing(true);
      const promptImprovement = `
        Act as a senior UI/UX Designer. Rewrite the following user prompt to be detailed, professional, and focused on modern, high-quality aesthetics (Glassmorphism, clean layout, good typography).
        User Prompt: "${prompt}"
        
        Return ONLY the refined prompt text, nothing else.
      `;

      const enhancedText = (await generateWithAI(promptImprovement)).trim();
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
      const promptText = `
      You are an expert frontend developer and UI/UX designer. You specialize in creating modern, minimalist, and highly aesthetic web components.
      
      **Task:** Generate a single, self-contained HTML file for the following component: "${prompt}"
      
      **Framework:** ${frameWork.value}
      
      **Requirements:**
      1. **Structure:** Return a COMPLETE HTML file (<!DOCTYPE html>...</html>).
      2. **Dependencies:**
         - ALWAYS include the **Tailwind CSS CDN** (<script src="https://cdn.tailwindcss.com"></script>) (if Tailwind or React selected).
         - Include **FontAwesome** (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">).
         - Include **Google Fonts** ('Inter', 'Outfit', or 'Playfair Display' based on context).
         ${frameWork.value === 'react-tailwind' ? `
         - Include React & ReactDOM CDNs:
           <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
           <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
         - Include Babel for JSX: <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
         - Write the React code inside <script type="text/babel">...</script>
         - Ensure the root element <div id="root"></div> exists and React renders into it.
         ` : ''}
      3. **Design Standard:** 
         - Use "Glassmorphism" or "Neomorphism" where appropriate.
         - Soft shadows, generous padding, and rounded corners (rounded-xl, rounded-2xl).
         - Modern color palettes (slate, zinc, indigo, violet).
      4. **Responsiveness:** Fully mobile-responsive.
      5. **Output:** Return ONLY the raw code inside a markdown code block.
      `;

      const text = await generateWithAI(promptText);

      const extractedCode = extractCode(text);
      setGeneratedCode(extractedCode);
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

  // --- Improve Mode Logic ---

  const improveActions = [
    { label: "Optimize Tailwind", icon: <IoSpeedometer />, prompt: "Optimize the Tailwind CSS classes. Remove duplicates, order them logically, and use shorter utility equivalents. Keep design identical." },
    { label: "Accessibility", icon: <IoAccessibility />, prompt: "Enhance accessibility. Add ARIA labels, ensure proper semantic HTML, and fix color contrast issues." },
    { label: "Dark Mode", icon: <IoMoon />, prompt: "Add Dark Mode support using Tailwind's 'dark:' modifier. Ensure it looks premium in both modes." },
    { label: "Add Animations", icon: <IoSparkles />, prompt: "Add subtle, high-quality micro-interactions and entry animations using Tailwind 'transition' or 'animate' classes." },
    { label: "Refactor", icon: <IoScan />, prompt: "Refactor code for readability, better indentation, and cleaner structure. Do not change functionality." },
  ];

  async function handleImprovement(actionPrompt) {
    const codeToRefine = mode === 'create' ? generatedCode : inputCode;
    if (!codeToRefine.trim()) return toast.error("No code to refine");

    try {
      setLoading(true);
      if (mode === 'improve') setImprovedCode("");

      const fullPrompt = `
        You are an expert code refactorer.
        
        **Task:** ${actionPrompt === 'custom' ? customImprovePrompt : actionPrompt}
        
        **Input Code:**
        \`\`\`
        ${codeToRefine}
        \`\`\`
        
        **Output:** Return ONLY the full improved code inside a markdown code block. Do not add explanations.
      `;

      const text = await generateWithAI(fullPrompt);
      const extracted = extractCode(text);

      if (mode === 'create') {
        setGeneratedCode(extracted);
        addToHistory(prompt + " (Refined)", extracted, frameWork.value);
        toast.success("Code refined ✨");
        setCustomImprovePrompt("");
      } else {
        setImprovedCode(extracted);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to improve code");
    } finally {
      setLoading(false);
    }
  }


  // --- Helper Functions ---

  const copyCode = async () => {
    const textToCopy = mode === 'create' ? generatedCode : improvedCode;
    if (!textToCopy.trim()) return;
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard");
  };

  const downloadFile = () => {
    const textToDown = mode === 'create' ? generatedCode : improvedCode;
    if (!textToDown.trim()) return;
    const blob = new Blob([textToDown], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "ForgeUI-Component.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded HTML");
  };

  const handleRefine = () => {
    setInputCode(generatedCode);
    setMode('improve');
    setImprovedCode("");
    setImproveTab('diff');
    toast.info("Transferred to Improve Mode");
  };


  // Custom Styles for React Select
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
      backgroundColor: "#18181b",
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

      <div className="min-h-[calc(100vh-80px)] px-4 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- LEFT COLUMN: INPUT --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Mode Toggle */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-1">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'create' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              ✨ Create New
            </button>
            <button
              onClick={() => setMode('improve')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'improve' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              🛠️ Improve Existing
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col h-full shadow-2xl flex-1 relative overflow-hidden">

            {mode === 'create' ? (
              // CREATE MODE INPUT
              <>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Create.
                  </h2>
                  <p className="text-gray-400 mt-2 font-light">
                    Describe your vision. Instant UI generation.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">AI Model</label>
                    <Select
                      options={aiOptions}
                      value={modelProvider}
                      styles={customSelectStyles}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(selected) => setModelProvider(selected)}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Framework</label>
                    <Select
                      options={options}
                      value={frameWork}
                      styles={customSelectStyles}
                      components={{ IndicatorSeparator: () => null }}
                      onChange={(selected) => setFrameWork(selected)}
                    />
                  </div>
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
                    className="w-full h-40 bg-white/5 border border-white/5 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:bg-white/10 focus:border-white/20 transition-all resize-none font-light leading-relaxed"
                    placeholder="e.g. A minimalist pricing card with glassmorphism effect..."
                  ></textarea>
                </div>

                <button
                  onClick={getResponse}
                  disabled={loading}
                  className="mt-6 w-full py-4 rounded-xl font-medium text-black bg-white hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && !generatedCode ? <ClipLoader color='#000' size={20} /> : <IoSparkles className="text-lg" />}
                  {loading && !generatedCode ? "Generating..." : "Generate Component"}
                </button>

                {outputScreen && (
                  <div className="mt-8 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Refine Result</label>
                      <button
                        onClick={() => handleImprovement('custom')}
                        disabled={loading || !customImprovePrompt.trim()}
                        className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                      >
                        {loading && generatedCode ? <ClipLoader size={10} color="#c084fc" /> : <IoSparkles />} Apply Changes
                      </button>
                    </div>
                    <textarea
                      value={customImprovePrompt}
                      onChange={(e) => setCustomImprovePrompt(e.target.value)}
                      placeholder="e.g. Make the background darker, add rounded corners..."
                      className="w-full h-20 bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-white placeholder-gray-600 outline-none focus:bg-white/10 focus:border-white/20 transition-all resize-none font-light"
                    />
                  </div>
                )}
              </>
            ) : (
              // IMPROVE MODE INPUT
              <>
                <div className="mb-4">
                  <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Refine.
                  </h2>
                  <p className="text-gray-400 mt-2 font-light">
                    Paste your code. Choose an enhancement.
                  </p>
                </div>

                <div className="flex-1 rounded-xl overflow-hidden border border-white/5 mb-4 max-h-[300px]">
                  <Editor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={inputCode}
                    onChange={(val) => setInputCode(val)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      padding: { top: 16 },
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  />
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Custom Improvement</label>
                    <button
                      onClick={() => handleImprovement('custom')}
                      disabled={loading || !customImprovePrompt.trim() || !inputCode.trim()}
                      className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
                    >
                      <IoSparkles /> Apply Custom
                    </button>
                  </div>
                  <textarea
                    value={customImprovePrompt}
                    onChange={(e) => setCustomImprovePrompt(e.target.value)}
                    placeholder="e.g. Change the background to blue, add a footer..."
                    className="w-full h-24 bg-white/5 border border-white/5 rounded-xl p-3 text-sm text-white placeholder-gray-600 outline-none focus:bg-white/10 focus:border-white/20 transition-all resize-none font-light"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {improveActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleImprovement(action.prompt)}
                      disabled={loading || !inputCode.trim()}
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-xs text-gray-300 hover:text-white text-left disabled:opacity-50"
                    >
                      <span className="text-lg text-purple-400">{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl">
                    <ClipLoader color="#fff" size={40} />
                    <p className="text-white mt-4 font-medium animate-pulse">Refining your code...</p>
                  </div>
                )}
              </>
            )}

          </div>
        </div>

        {/* --- RIGHT COLUMN: OUTPUT --- */}
        <div className="lg:col-span-7 h-[600px] lg:h-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">

          {/* Conditional Rendering based on Mode */}
          {mode === 'create' ? (
            // CREATE MODE OUTPUT
            !outputScreen ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <IoCodeSlash className="text-3xl opacity-50" />
                </div>
                <p className="font-light">Generated code will appear here.</p>
              </div>
            ) : (
              <>
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
                  <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg">
                    <button onClick={() => setTab(1)} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === 1 ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Code</button>
                    <button onClick={() => setTab(2)} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === 2 ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Preview</button>
                  </div>
                  <div className="flex items-center gap-3">
                    {tab === 1 && (
                      <>
                        <button onClick={copyCode} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Copy"><IoCopyOutline /></button>
                        <button onClick={downloadFile} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Download"><IoDownloadOutline /></button>
                      </>
                    )}
                    {tab === 2 && (
                      <>
                        <button onClick={() => setRefreshKey(p => p + 1)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Refresh"><IoRefresh /></button>
                        <button onClick={() => setIsNewTabOpen(true)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Expand"><IoOpenOutline /></button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex-1 relative">
                  {loading && generatedCode && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <ClipLoader color="#fff" size={40} />
                      <p className="text-white mt-4 font-medium animate-pulse">Refining with AI...</p>
                    </div>
                  )}
                  {tab === 1 ? (
                    <Editor value={generatedCode} height="100%" theme='vs-dark' language="html" options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 20 }, fontFamily: "'JetBrains Mono', monospace" }} />
                  ) : (
                    <iframe key={refreshKey} srcDoc={generatedCode} className="w-full h-full bg-white" title="preview" />
                  )}
                </div>
              </>
            )
          ) : (
            // IMPROVE MODE OUTPUT
            !improvedCode ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <IoSparkles className="text-3xl opacity-50" />
                </div>
                <p className="font-light">Improved code will appear here.</p>
              </div>
            ) : (
              <>
                <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
                  <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg">
                    <button onClick={() => setImproveTab('diff')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${improveTab === 'diff' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Diff View</button>
                    <button onClick={() => setImproveTab('code')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${improveTab === 'code' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Code</button>
                    <button onClick={() => setImproveTab('preview')} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${improveTab === 'preview' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>Preview</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={copyCode} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Copy"><IoCopyOutline /></button>
                    <button onClick={downloadFile} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Download"><IoDownloadOutline /></button>
                  </div>
                </div>
                <div className="flex-1 relative">
                  {improveTab === 'diff' && (
                    <DiffEditor
                      original={inputCode}
                      modified={improvedCode}
                      height="100%"
                      theme="vs-dark"
                      language="html"
                      options={{
                        fontSize: 14,
                        renderSideBySide: true,
                        padding: { top: 20 },
                        fontFamily: "'JetBrains Mono', monospace"
                      }}
                    />
                  )}
                  {improveTab === 'code' && (
                    <Editor
                      value={improvedCode}
                      height="100%"
                      theme='vs-dark'
                      language="html"
                      options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 20 }, fontFamily: "'JetBrains Mono', monospace" }}
                    />
                  )}
                  {improveTab === 'preview' && (
                    <iframe srcDoc={improvedCode} className="w-full h-full bg-white" title="preview" />
                  )}
                </div>
              </>
            )
          )}
        </div>

      </div>

      {/* Fullscreen Modal (Create Mode Only) */}
      {isNewTabOpen && mode === 'create' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
          <div className="h-16 flex items-center justify-between px-8 border-b border-white/10">
            <span className="text-white font-medium">Fullscreen Preview</span>
            <button onClick={() => setIsNewTabOpen(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
              <IoClose />
            </button>
          </div>
          <div className="flex-1 p-8">
            <iframe srcDoc={generatedCode} className="w-full h-full bg-white rounded-xl shadow-2xl"></iframe>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
