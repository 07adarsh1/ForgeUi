import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import HistorySidebar from '../components/HistorySidebar'
import { libraryService } from '../lib/db';
import { generatePreviewHtml } from '../lib/preview';
import { extractCode, prepareComponentForSave } from '../lib/componentUtils';
import SaveModal from '../components/SaveModal';
import { IoClose, IoSparkles, IoSpeedometer, IoCodeSlash } from 'react-icons/io5';

import { formOptions, aiOptions, themeOptions, densityOptions } from '../lib/constants';
import { useHistory } from '../hooks/useHistory';
import { useBlueprint } from '../hooks/useBlueprint';
import { useAIAction } from '../hooks/useAIAction';

// Subcomponents
import CreateInput from '../components/home/CreateInput';
import ImproveInput from '../components/home/ImproveInput';
import OutputDisplay from '../components/home/OutputDisplay';
import FullPageInput from '../components/home/FullPageInput';
import EditSectionModal from '../components/home/EditSectionModal';
import SectionPickerModal from '../components/home/SectionPickerModal';

const Home = () => {

  // Global State
  const [mode, setMode] = useState('create');
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 'Create' Mode State
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(formOptions[1]);
  const [modelProvider, setModelProvider] = useState(aiOptions[0]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [themeOverride, setThemeOverride] = useState(themeOptions[0]);
  const [densityOverride, setDensityOverride] = useState(densityOptions[0]);

  // 'Improve' Mode State
  const [inputCode, setInputCode] = useState("");
  const [improvedCode, setImprovedCode] = useState("");
  const [improveTab, setImproveTab] = useState('diff');
  const [customImprovePrompt, setCustomImprovePrompt] = useState("");

  // Mobile State
  const [mobileTab, setMobileTab] = useState('create');

  const {
    history,
    isHistoryOpen,
    setIsHistoryOpen,
    addToHistory,
    clearHistory,
    loadHistoryItem
  } = useHistory(setPrompt, setGeneratedCode, setFrameWork, setMode, setOutputScreen, setTab);

  const {
    activeBlueprint,
    setActiveBlueprint,
    originalBlueprint,
    setOriginalBlueprint,
    editingSectionIndex,
    setEditingSectionIndex,
    addingSectionIndex,
    setAddingSectionIndex,
    handleSaveSection,
    handleAddSection,
  } = useBlueprint(setGeneratedCode, setFrameWork, setPreviewHtml);

  const {
    loading,
    enhancing,
    enhancePrompt,
    getFullPageBlueprint,
    getResponse,
    handleImprovement
  } = useAIAction({
    prompt, setPrompt, frameWork, setFrameWork, modelProvider,
    setGeneratedCode, setPreviewHtml, addToHistory,
    mode, inputCode, setImprovedCode, customImprovePrompt, setCustomImprovePrompt,
    themeOverride, densityOverride,
    setActiveBlueprint, setOriginalBlueprint,
    setOutputScreen, setTab, setMobileTab
  });

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
        onLoad={loadHistoryItem}
        onClear={clearHistory}
      />

      {/* Main Content Area */}
      {/* Mobile: 1 col, Desktop: 12 col grid */}
      <div className="min-h-[calc(100vh-80px)] px-4 lg:px-12 py-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24 md:pb-8">

        {/* --- LEFT COLUMN: INPUT --- */}
        {/* Visible on Mobile if mobileTab is 'create', always visible on desktop */}
        <div className={`lg:col-span-5 flex flex-col gap-6 ${mobileTab !== 'create' ? 'hidden md:flex' : 'flex'}`}>

          {/* Mode Toggle */}
          <div className="flex bg-[#222222] p-1 rounded-xl w-64 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-[#333333] border border-white/10 shadow-lg transition-transform duration-300 ease-out`}
              style={{ transform: mode === 'create' ? 'translateX(0)' : 'translateX(calc(100% + 4px))' }}
            ></div>
            <button
              onClick={() => setMode('create')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors z-10 ${mode === 'create' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-2 opacity-70"></i>
              Create
            </button>
            <button
              onClick={() => setMode('improve')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-sm font-semibold transition-colors z-10 ${mode === 'improve' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-code-merge mr-2 opacity-70"></i>
              Improve
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col h-full shadow-2xl flex-1 relative overflow-hidden">
            {mode === 'create' && (
              <div className="opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
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

                <div className="hidden">
                  <CreateInput
                    modelProvider={modelProvider}
                    setModelProvider={setModelProvider}
                    frameWork={frameWork}
                    setFrameWork={setFrameWork}
                    options={formOptions}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    aiOptions={aiOptions}
                    customSelectStyles={customSelectStyles}
                    enhancePrompt={enhancePrompt}
                    enhancing={enhancing}
                    getResponse={getResponse}
                    loading={loading}
                    generatedCode={generatedCode}
                  />
                </div>
              </div>
            )}

            {mode === 'improve' && (
              <div className="opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ImproveInput
                  inputCode={inputCode}
                  setInputCode={setInputCode}
                  customImprovePrompt={customImprovePrompt}
                  setCustomImprovePrompt={setCustomImprovePrompt}
                  handleImprovement={handleImprovement}
                  loading={loading}
                />
              </div>
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
          onClick={() => { setMobileTab('preview'); setTab(2); setImproveTab('preview'); }}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'preview' ? 'text-white' : 'text-gray-500'}`}
        >
          <IoSpeedometer size={20} />
          <span className="text-[10px] font-medium">Preview</span>
        </button>
        <button
          onClick={() => { setMobileTab('code'); setTab(1); setImproveTab('code'); }}
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


