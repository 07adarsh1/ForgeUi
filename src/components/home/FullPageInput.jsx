import React from 'react';
import Select from 'react-select';
import { ClipLoader } from 'react-spinners';
import { IoSparkles } from 'react-icons/io5';

const FullPageInput = ({
    modelProvider,
    setModelProvider,
    prompt,
    setPrompt,
    aiOptions,
    customSelectStyles,
    enhancePrompt,
    enhancing,
    getFullPageBlueprint,
    loading,
    generatedCode,
    themeOverride,
    setThemeOverride,
    densityOverride,
    setDensityOverride,
    themeOptions,
    densityOptions
}) => {
    return (
        <>
            <div className="mb-6">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">
                    Full Page Generator.
                </h2>
                <p className="text-gray-400 mt-2 font-light">
                    Describe your website. AI generates a full multi-section page.
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
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Theme</label>
                    <Select
                        options={themeOptions}
                        value={themeOverride}
                        styles={customSelectStyles}
                        components={{ IndicatorSeparator: () => null }}
                        onChange={setThemeOverride}
                    />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Density</label>
                    <Select
                        options={densityOptions}
                        value={densityOverride}
                        styles={customSelectStyles}
                        components={{ IndicatorSeparator: () => null }}
                        onChange={setDensityOverride}
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">Website Prompt</label>
                    <button
                        onClick={enhancePrompt}
                        disabled={enhancing || !prompt.trim()}
                        className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {enhancing ? <ClipLoader size={10} color="#34d399" /> : <IoSparkles />}
                        {enhancing ? "Enhancing..." : "Enhance with AI"}
                    </button>
                </div>
                <textarea
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                    className="w-full h-40 bg-white/5 border border-white/5 rounded-2xl p-4 text-white placeholder-gray-600 outline-none focus:bg-white/10 focus:border-white/20 transition-all resize-none font-light leading-relaxed"
                    placeholder="e.g. A modern dark-themed SaaS landing page for an AI developer tool..."
                ></textarea>
            </div>

            <button
                onClick={getFullPageBlueprint}
                disabled={loading}
                className="mt-6 w-full py-4 rounded-xl font-medium text-black bg-white hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading && !generatedCode ? <ClipLoader color='#000' size={20} /> : <IoSparkles className="text-lg" />}
                {loading && !generatedCode ? "Generating Blueprint..." : "Generate Full Page"}
            </button>
        </>
    );
};

export default FullPageInput;
