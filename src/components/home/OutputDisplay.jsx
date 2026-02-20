
import React from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { IoCodeSlash, IoCopyOutline, IoDownloadOutline, IoSaveOutline, IoRefresh, IoOpenOutline, IoSparkles } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';
import { generatePreviewHtml } from '../../lib/preview';

const OutputDisplay = ({
    mode,
    mobileTab,
    setMobileTab,
    outputScreen,
    generatedCode,
    previewHtml,
    tab,
    setTab,
    loading,
    copyCode,
    downloadFile,
    openSaveModal,
    refreshKey,
    setRefreshKey,
    setIsNewTabOpen,
    improvedCode,
    inputCode,
    improveTab,
    setImproveTab,
    frameWorkValue
}) => {
    return (
        <div className={`lg:col-span-7 h-[calc(100vh-200px)] lg:h-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl ${mobileTab === 'create' ? 'hidden md:flex' : 'flex'}`}>

            {/* CREATE MODE OUTPUT */}
            {(mode === 'create' || mode === 'fullpage') ? (
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
                                <button onClick={copyCode} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Copy"><IoCopyOutline /></button>
                                <button onClick={downloadFile} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Download"><IoDownloadOutline /></button>
                                <button onClick={openSaveModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Save to Library"><IoSaveOutline /></button>

                                {tab === 2 && (
                                    <>
                                        <div className="w-px h-4 bg-white/10 mx-1"></div>
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
                                <Editor value={generatedCode} height="100%" theme='vs-dark' language={frameWorkValue === 'react-tailwind' ? 'typescript' : 'html'} options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 20 }, fontFamily: "'JetBrains Mono', monospace" }} />
                            ) : (
                                <iframe key={refreshKey} srcDoc={previewHtml} className="w-full h-full bg-white" title="preview" />
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
                                <button onClick={openSaveModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10" title="Save to Library"><IoSaveOutline /></button>
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
                                    language={frameWorkValue === 'react-tailwind' ? 'typescript' : 'html'}
                                    options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 20 }, fontFamily: "'JetBrains Mono', monospace" }}
                                />
                            )}
                            {improveTab === 'preview' && (
                                <iframe srcDoc={generatePreviewHtml(improvedCode, frameWorkValue)} className="w-full h-full bg-white" title="preview" />
                            )}
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default OutputDisplay;
