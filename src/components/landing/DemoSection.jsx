import React from 'react';

const DemoSection = () => {
    return (
        <section id="demo" className="py-20 px-6 border-b border-white/5 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto text-center">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">See it in action</h2>
                    <p className="text-gray-400">From idea to functional code in seconds.</p>
                </div>

                {/* Browser Window Mockup */}
                <div className="max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#09090b] relative group hover:border-white/20 transition-all duration-500">

                    {/* Window Controls Header */}
                    <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />

                        {/* Fake URL Bar */}
                        <div className="ml-4 flex-1 max-w-xl mx-auto h-6 bg-black/40 rounded-md border border-white/5 flex items-center justify-center text-[10px] text-gray-500 font-mono">
                            https://forgeui.dev/generate
                        </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative">
                        <img
                            src="/demo_screenshot_v2.png"
                            alt="ForgeUI App Demo Screenshot"
                            className="w-full h-auto opacity-100 block"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default DemoSection;
