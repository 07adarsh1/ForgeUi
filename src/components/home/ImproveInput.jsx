
import React from 'react';
import Editor from '@monaco-editor/react';
import { ClipLoader } from 'react-spinners';
import { IoSparkles, IoSpeedometer, IoAccessibility, IoMoon, IoScan } from 'react-icons/io5';

const ImproveInput = ({
    inputCode,
    setInputCode,
    customImprovePrompt,
    setCustomImprovePrompt,
    handleImprovement,
    loading
}) => {

    const improveActions = [
        { label: "Optimize Tailwind", icon: <IoSpeedometer />, prompt: "Optimize the Tailwind CSS classes. Remove duplicates, order them logically, and use shorter utility equivalents. Keep design identical." },
        { label: "Accessibility", icon: <IoAccessibility />, prompt: "Enhance accessibility. Add ARIA labels, ensure proper semantic HTML, and fix color contrast issues." },
        { label: "Dark Mode", icon: <IoMoon />, prompt: "Add Dark Mode support using Tailwind's 'dark:' modifier. Ensure it looks premium in both modes." },
        { label: "Add Animations", icon: <IoSparkles />, prompt: "Add subtle, high-quality micro-interactions and entry animations using Tailwind 'transition' or 'animate' classes." },
        { label: "Refactor", icon: <IoScan />, prompt: "Refactor code for readability, better indentation, and cleaner structure. Do not change functionality." },
    ];

    return (
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
    );
};

export default ImproveInput;
