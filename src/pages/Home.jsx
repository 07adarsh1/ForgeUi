import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import HistorySidebar from '../components/HistorySidebar'
import { libraryService } from '../lib/db';
import { generatePreviewHtml } from '../lib/preview';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from 'react-toastify';
import Groq from "groq-sdk";
import { getCreationPrompt, getImprovementPrompt } from '../lib/prompts';
import { extractCode, prepareComponentForSave } from '../lib/componentUtils';
import { buildEnhancementPrompt } from '../lib/promptEnhancer';
import SaveModal from '../components/SaveModal';
import { IoClose, IoSparkles, IoSpeedometer, IoCodeSlash } from 'react-icons/io5';
import { getFullPageBlueprintPrompt } from '../lib/pagePrompts';
import { generatePageCode } from '../lib/recipes';

// Subcomponents
import CreateInput from '../components/home/CreateInput';
import ImproveInput from '../components/home/ImproveInput';
import OutputDisplay from '../components/home/OutputDisplay';
import FullPageInput from '../components/home/FullPageInput';
import EditSectionModal from '../components/home/EditSectionModal';
import SectionPickerModal from '../components/home/SectionPickerModal';

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

  const themeOptions = [
    { value: 'auto', label: 'Auto (Detect from prompt)' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'bold', label: 'Bold' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  const densityOptions = [
    { value: 'auto', label: 'Auto (Detect from prompt)' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' }
  ];

  // Global State
  const [mode, setMode] = useState('create'); // 'create' | 'improve'
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 'Create' Mode State
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[1]);
  const [modelProvider, setModelProvider] = useState(aiOptions[0]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [enhancing, setEnhancing] = useState(false);
  const [themeOverride, setThemeOverride] = useState(themeOptions[0]);
  const [densityOverride, setDensityOverride] = useState(densityOptions[0]);

  // 'Improve' Mode State
  const [inputCode, setInputCode] = useState("");
  const [improvedCode, setImprovedCode] = useState("");

  const [improveTab, setImproveTab] = useState('diff'); // 'diff' | 'code' | 'preview'
  const [customImprovePrompt, setCustomImprovePrompt] = useState("");

  const [activeBlueprint, setActiveBlueprint] = useState(null);
  const [originalBlueprint, setOriginalBlueprint] = useState(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [addingSectionIndex, setAddingSectionIndex] = useState(null);

  // 🕒 History State
  const [history, setHistory] = useState([]);

  // Mobile State
  const [mobileTab, setMobileTab] = useState('create'); // 'create' | 'preview' | 'code'

  useEffect(() => {
    const savedHistory = localStorage.getItem('forgeui_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('forgeui_history', JSON.stringify(history));
  }, [history]);

  const updateBlueprint = (newBlueprint) => {
    setActiveBlueprint(newBlueprint);
    const pageCode = generatePageCode(newBlueprint);
    setGeneratedCode(pageCode);
    const reactFw = options.find(o => o.value === 'react-tailwind');
    setFrameWork(reactFw);
    setPreviewHtml(generatePreviewHtml(pageCode, 'react-tailwind'));
  };

  useEffect(() => {
    const handleIframeMessage = (e) => {
      let { type, index } = e.data || {};
      if (!type) return;

      index = Number(index);

      if (type === 'EDIT_SECTION') {
        setEditingSectionIndex(index);
      } else if (type === 'OPEN_ADD_MODAL') {
        setAddingSectionIndex(index);
      } else if (type === 'DELETE_SECTION') {
        if (!activeBlueprint) return;
        const newBlueprint = { ...activeBlueprint };
        newBlueprint.sections = newBlueprint.sections.filter((_, i) => i !== index);
        updateBlueprint(newBlueprint);
      } else if (type === 'REGENERATE_SECTION') {
        if (!activeBlueprint || !originalBlueprint) return;
        const newBlueprint = { ...activeBlueprint };
        newBlueprint.sections = [...newBlueprint.sections];
        const targetId = newBlueprint.sections[index]?.id;
        const origSection = originalBlueprint.sections.find(s => s.id === targetId);
        if (origSection) {
          newBlueprint.sections[index] = JSON.parse(JSON.stringify(origSection));
          updateBlueprint(newBlueprint);
        }
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [activeBlueprint, originalBlueprint, options]);

  const handleSaveSection = (updatedSection) => {
    if (activeBlueprint !== null && editingSectionIndex !== null) {
      const newBlueprint = { ...activeBlueprint };
      newBlueprint.sections[editingSectionIndex] = updatedSection;
      updateBlueprint(newBlueprint);
      setEditingSectionIndex(null);
    }
  };

  const handleAddSection = (sectionConfig) => {
    if (activeBlueprint !== null && addingSectionIndex !== null) {
      const newBlueprint = { ...activeBlueprint };

      const newSection = {
        id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type: sectionConfig.type,
        props: JSON.parse(JSON.stringify(sectionConfig.defaultProps))
      };

      newBlueprint.sections.splice(addingSectionIndex, 0, newSection);
      updateBlueprint(newBlueprint);
      setAddingSectionIndex(null);
    }
  };

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
      const promptImprovement = buildEnhancementPrompt(prompt, frameWork.value);

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

  const getFullPageBlueprint = async () => {
    if (!prompt.trim()) return toast.error("Please describe your website first");

    try {
      setLoading(true);

      let finalTheme = themeOverride.value;
      let finalDensity = densityOverride.value;

      if (finalTheme === 'auto') {
        const p = prompt.toLowerCase();
        if (p.includes('enterprise') || p.includes('corporate') || p.includes('b2b') || p.includes('healthcare') || p.includes('finance')) {
          finalTheme = 'enterprise';
        } else if (p.includes('ai') || p.includes('startup') || p.includes('modern') || p.includes('saas') || p.includes('innovation')) {
          finalTheme = 'bold';
        } else {
          finalTheme = 'minimal';
        }
      }

      if (finalDensity === 'auto') {
        const p = prompt.toLowerCase();
        if (p.includes('dashboard') || p.includes('admin') || p.includes('analytics')) {
          finalDensity = 'compact';
        } else {
          finalDensity = 'comfortable';
        }
      }

      const promptText = getFullPageBlueprintPrompt(prompt, finalTheme, finalDensity);

      const text = await generateWithAI(promptText);

      // Parse JSON from text, extracting markdown codeblock if Groq returned text around it
      let jsonStr = text;
      const codeBlockMatch = text.match(/```(?:\w+)?\n?([\s\S]*?)```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
      }

      const extractedJSON = jsonStr.match(/\{[\s\S]*\}/);
      if (!extractedJSON) throw new Error("Invalid format returned by AI");
      const blueprint = JSON.parse(extractedJSON[0]);
      setActiveBlueprint(blueprint);
      setOriginalBlueprint(JSON.parse(JSON.stringify(blueprint)));

      const pageCode = generatePageCode(blueprint);

      setGeneratedCode(pageCode);
      const reactFw = options.find(o => o.value === 'react-tailwind');
      setFrameWork(reactFw);

      const preview = generatePreviewHtml(pageCode, 'react-tailwind');
      setPreviewHtml(preview);

      addToHistory(prompt + ' (Full Page)', pageCode, 'react-tailwind');

      setOutputScreen(true);
      setTab(2);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to generate blueprint or parse JSON");
    } finally {
      setLoading(false);
      if (window.innerWidth < 768) setMobileTab('preview');
    }
  };

  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const promptText = getCreationPrompt(frameWork.value, prompt);

      const text = await generateWithAI(promptText);

      const extractedCode = extractCode(text);
      setGeneratedCode(extractedCode);

      // Generate preview HTML separate from the source code
      const preview = generatePreviewHtml(extractedCode, frameWork.value);
      setPreviewHtml(preview);

      addToHistory(prompt, extractedCode, frameWork.value);

      setOutputScreen(true);
      setTab(2);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong while generating code");
    } finally {
      setLoading(false);
      // Switch to preview on mobile after generation
      if (window.innerWidth < 768) setMobileTab('preview');
    }
  };

  // --- Improve Mode Logic ---

  async function handleImprovement(actionPrompt) {
    const codeToRefine = mode === 'create' ? generatedCode : inputCode;
    if (!codeToRefine.trim()) return toast.error("No code to refine");

    try {
      setLoading(true);
      if (mode === 'improve') setImprovedCode("");

      const userInstruction = actionPrompt === 'custom' ? customImprovePrompt : actionPrompt;
      const fullPrompt = getImprovementPrompt(userInstruction, codeToRefine);

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

  const openSaveModal = () => {
    const codeToSave = (mode === 'create' || mode === 'fullpage') ? generatedCode : improvedCode;
    if (!codeToSave) return;
    setIsSaveModalOpen(true);
  };

  const confirmSave = async (customName, customTags) => {
    const codeToSave = (mode === 'create' || mode === 'fullpage') ? generatedCode : improvedCode;
    if (!codeToSave) return;

    try {
      // Generate folder name from CUSTOM NAME, not prompt
      let folderName = customName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (!folderName) folderName = "component";

      // Ensure unique folder name
      let uniqueFolderName = folderName;
      let counter = 1;
      while (await libraryService.isFolderNameTaken(uniqueFolderName)) {
        uniqueFolderName = `${folderName}-${counter}`;
        counter++;
      }

      const id = libraryService.generateId(uniqueFolderName);
      const timestamp = new Date().toISOString();
      const isReact = frameWork.value === 'react-tailwind';

      // Safeguard: Prevent saving HTML as React
      if (isReact && (codeToSave.trim().startsWith('<!DOCTYPE') || codeToSave.trim().startsWith('<html'))) {
        toast.error("Error: Current code looks like HTML, but 'React' format is selected. Please regenerate to match the format.");
        return;
      }

      // Pass customName and customTags to helper
      const newComponent = prepareComponentForSave(codeToSave, frameWork.value, uniqueFolderName, prompt, timestamp, customName, customTags, mode);
      newComponent.id = id;

      await libraryService.saveComponent(newComponent);
      toast.success("Saved to Library 📚");
      setIsSaveModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save to library");
    }
  };


  // --- Helper Functions ---

  const copyCode = async () => {
    const textToCopy = (mode === 'create' || mode === 'fullpage') ? generatedCode : improvedCode;
    if (!textToCopy.trim()) return;
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard");
  };

  const downloadFile = () => {
    const textToDown = (mode === 'create' || mode === 'fullpage') ? generatedCode : improvedCode;
    if (!textToDown.trim()) return;
    const blob = new Blob([textToDown], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ForgeUI-Component.${frameWork.value === 'react-tailwind' ? 'tsx' : 'html'}`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded Source");
  };

  const handleRefine = () => {
    setInputCode(generatedCode);
    setMode('improve');
    setImprovedCode("");
    setImproveTab('diff');
    toast.info("Transferred to Improve Mode");
    if (window.innerWidth < 768) setMobileTab('create');
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

      {/* Main Content Area */}
      {/* Mobile: 1 col, Desktop: 12 col grid */}
      <div className="min-h-[calc(100vh-80px)] px-4 lg:px-12 py-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 md:pb-8">

        {/* --- LEFT COLUMN: INPUT --- */}
        {/* Visible on Mobile if mobileTab is 'create', always visible on desktop */}
        <div className={`lg:col-span-5 flex flex-col gap-6 ${mobileTab !== 'create' ? 'hidden md:flex' : 'flex'}`}>

          {/* Mode Toggle */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex gap-1">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'create' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              ✨ Create
            </button>
            <button
              onClick={() => setMode('fullpage')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'fullpage' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              📄 Full Page
            </button>
            <button
              onClick={() => setMode('improve')}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${mode === 'improve' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              🛠️ Improve
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col h-full shadow-2xl flex-1 relative overflow-hidden">

            {mode === 'create' && (
              <CreateInput
                modelProvider={modelProvider}
                setModelProvider={setModelProvider}
                frameWork={frameWork}
                setFrameWork={setFrameWork}
                prompt={prompt}
                setPrompt={setPrompt}
                aiOptions={aiOptions}
                frameworkOptions={options}
                customSelectStyles={customSelectStyles}
                enhancePrompt={enhancePrompt}
                enhancing={enhancing}
                getResponse={getResponse}
                loading={loading}
                generatedCode={generatedCode}
                outputScreen={outputScreen}
                customImprovePrompt={customImprovePrompt}
                setCustomImprovePrompt={setCustomImprovePrompt}
                handleImprovement={handleImprovement}
              />
            )}

            {mode === 'fullpage' && (
              <FullPageInput
                modelProvider={modelProvider}
                setModelProvider={setModelProvider}
                prompt={prompt}
                setPrompt={setPrompt}
                aiOptions={aiOptions}
                customSelectStyles={customSelectStyles}
                enhancePrompt={enhancePrompt}
                enhancing={enhancing}
                getFullPageBlueprint={getFullPageBlueprint}
                loading={loading}
                generatedCode={generatedCode}
                themeOverride={themeOverride}
                setThemeOverride={setThemeOverride}
                densityOverride={densityOverride}
                setDensityOverride={setDensityOverride}
                themeOptions={themeOptions}
                densityOptions={densityOptions}
              />
            )}

            {mode === 'improve' && (
              <ImproveInput
                inputCode={inputCode}
                setInputCode={setInputCode}
                customImprovePrompt={customImprovePrompt}
                setCustomImprovePrompt={setCustomImprovePrompt}
                handleImprovement={handleImprovement}
                loading={loading}
              />
            )}

          </div>
        </div>

        {/* --- RIGHT COLUMN: OUTPUT --- */}
        <OutputDisplay
          mode={mode}
          mobileTab={mobileTab}
          setMobileTab={setMobileTab}
          outputScreen={outputScreen}
          generatedCode={generatedCode}
          previewHtml={previewHtml}
          tab={tab}
          setTab={setTab}
          loading={loading}
          copyCode={copyCode}
          downloadFile={downloadFile}
          openSaveModal={openSaveModal}
          refreshKey={refreshKey}
          setRefreshKey={setRefreshKey}
          setIsNewTabOpen={setIsNewTabOpen}
          improvedCode={improvedCode}
          inputCode={inputCode}
          improveTab={improveTab}
          setImproveTab={setImproveTab}
          frameWorkValue={frameWork.value}
        />

      </div>

      {/* Fullscreen Modal (Create Mode Only) */}
      {
        isNewTabOpen && mode === 'create' && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
            <div className="h-16 flex items-center justify-between px-8 border-b border-white/10">
              <span className="text-white font-medium">Fullscreen Preview</span>
              <button onClick={() => setIsNewTabOpen(false)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
                <IoClose />
              </button>
            </div>
            <div className="flex-1 p-8">
              <iframe srcDoc={previewHtml} className="w-full h-full bg-white rounded-xl shadow-2xl"></iframe>
            </div>
          </div>
        )
      }

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#18181b] border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        <button
          onClick={() => setMobileTab('create')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'create' ? 'text-white' : 'text-gray-500'}`}
        >
          <IoSparkles size={20} />
          <span className="text-[10px] font-medium">Create</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'preview' ? 'text-white' : 'text-gray-500'}`}
        >
          <IoSpeedometer size={20} />
          <span className="text-[10px] font-medium">Preview</span>
        </button>
        <button
          onClick={() => setMobileTab('code')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'code' ? 'text-white' : 'text-gray-500'}`}
        >
          <IoCodeSlash size={20} />
          <span className="text-[10px] font-medium">Code</span>
        </button>
      </div>

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={confirmSave}
        initialName={(prompt || "Untitled Component").split(' ').slice(0, 3).join(' ')}
      />

      {editingSectionIndex !== null && activeBlueprint && (
        <EditSectionModal
          section={activeBlueprint.sections[editingSectionIndex]}
          onSave={handleSaveSection}
          onClose={() => setEditingSectionIndex(null)}
        />
      )}

      <SectionPickerModal
        isOpen={addingSectionIndex !== null}
        onClose={() => setAddingSectionIndex(null)}
        onSelect={handleAddSection}
      />

    </>
  )
};

export default Home


