import React from 'react';
import { IoLogoReact, IoLogoNodejs } from 'react-icons/io5';
import { SiTailwindcss, SiVite, SiNextdotjs } from 'react-icons/si';

const DeveloperFeatures = () => {
    return (
        <section className="py-20 px-6 bg-white/[0.02] border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-bold mb-2 text-gray-200">Built for Modern Development</h2>
                    <p className="text-sm text-gray-500">Compatible with your favorite stack.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
                    <div className="flex items-center gap-3 text-gray-300">
                        <IoLogoReact className="text-3xl text-cyan-400" />
                        <span className="font-medium">React 18+</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <SiTailwindcss className="text-3xl text-cyan-300" />
                        <span className="font-medium">Tailwind CSS</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <IoLogoNodejs className="text-3xl text-green-400" />
                        <span className="font-medium">No Backend Req.</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <SiVite className="text-3xl text-purple-400" />
                        <span className="font-medium">Vite Ready</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <SiNextdotjs className="text-3xl text-white" />
                        <span className="font-medium">Next.js Friendly</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DeveloperFeatures;
