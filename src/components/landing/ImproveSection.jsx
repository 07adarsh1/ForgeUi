import React from 'react';
import { IoSpeedometer, IoScan } from 'react-icons/io5';

const ImproveSection = () => {
    return (
        <section className="py-16 md:py-24 px-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-16">
                <div className="flex-1 space-y-8">
                    <h2 className="text-3xl md:text-5xl font-bold">
                        Already have code? <br />
                        <span className="text-blue-400">Make it better.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        ForgeUI isn't just a generator. Paste your existing messy HTML or CSS, and let our agents refactor it for you.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                                <IoSpeedometer className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Optimize Tailwind</h4>
                                <p className="text-sm text-gray-500">Deduplicate classes and fix conflicts.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                                <IoScan className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Refactor & Format</h4>
                                <p className="text-sm text-gray-500">Clean up indentation and structure.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative w-full h-[400px] rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-2xl flex flex-col overflow-hidden group">
                    {/* Mock Code Editor UI */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                        <span className="text-xs text-gray-500">OldComponent.jsx</span>
                        <span className="text-xs text-blue-400 flex items-center gap-1">
                            ✨ AI Improving...
                        </span>
                    </div>
                    <div className="p-6 font-mono text-xs md:text-sm text-gray-400 space-y-2 opacity-50 blur-[1px] group-hover:blur-0 group-hover:opacity-100 transition-all duration-500">
                        <p>{`<div class="btn btn-primary" style="margin: 10px;">`}</p>
                        <p className="pl-4">{`Click Me`}</p>
                        <p>{`</div>`}</p>
                        <div className="my-4 h-px bg-white/10" />
                        <p className="text-green-400">{`// Refactored Output`}</p>
                        <p className="text-white">{`<button className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg">`}</p>
                        <p className="pl-4 text-white">{`Click Me`}</p>
                        <p className="text-white">{`</button>`}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImproveSection;
