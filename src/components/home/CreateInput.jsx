
import React from 'react';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { IoSparkles } from 'react-icons/io5';

const CreateInput = ({
    modelProvider,
    setModelProvider,
    frameWork,
    setFrameWork,
    prompt,
    setPrompt,
    aiOptions,
    frameworkOptions,
    customSelectStyles,
    enhancePrompt,
    enhancing,
    getResponse,
    loading,
    generatedCode,
    outputScreen,
    customImprovePrompt,
    setCustomImprovePrompt,
    handleImprovement
}) => {
    return (
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
                        onChange={setModelProvider}
                    />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Framework</label>
                    <Select
                        options={frameworkOptions}
                        value={frameWork}
                        styles={customSelectStyles}
                        components={{ IndicatorSeparator: () => null }}
                        onChange={setFrameWork}
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
    );
};

export default CreateInput;
