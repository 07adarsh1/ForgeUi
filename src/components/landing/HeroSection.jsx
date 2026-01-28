import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowForward, IoPlayCircleOutline } from 'react-icons/io5';

const HeroSection = () => {
    const navigate = useNavigate();
    const [currentText, setCurrentText] = useState('');
    const fullText = "A glassmorphic pricing card with a dark gradient background...";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setCurrentText(fullText.slice(0, index + 1));
            index++;
            if (index > fullText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >


                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 leading-[1.1] md:leading-[1.1]">
                    Turn text into production <br className="hidden md:block" />
                    <span className="text-purple-400 inline-block">React Components.</span>
                </h1>

                <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4 md:px-0">
                    ForgeUI builds beautiful, accessible, and responsive usage-ready UI components in seconds.
                    Stop fighting with CSS—start shipping.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/generate')}
                        className="h-12 px-8 w-full sm:w-auto rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Start Generating Free <IoArrowForward />
                    </button>
                    <button
                        onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}
                        className="h-12 px-8 w-full sm:w-auto rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium backdrop-blur-md flex items-center justify-center gap-2"
                    >
                        Watch Demo <IoPlayCircleOutline className="text-xl" />
                    </button>
                </div>

                {/* Typing Simulation Component showing prompt -> code */}
                <div className="relative w-full max-w-3xl mx-auto bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl text-left">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="ml-4 text-xs text-gray-500 font-mono">forge-ui-agent</div>
                    </div>
                    <div className="p-6 font-mono text-sm h-[180px] md:h-[220px] flex flex-col">
                        <div className="text-purple-400 mb-2">➜  ~ Explain your component</div>
                        <div className="text-gray-300 typing-cursor relative">
                            {currentText}
                            <span className="animate-pulse inline-block w-2 h-4 bg-white ml-1 align-middle"></span>
                        </div>
                        {currentText.length === fullText.length && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 text-green-400"
                            >
                                <br />
                                <span>✔ Generating component structure...</span><br />
                                <span>✔ Applying Tailwind classes...</span><br />
                                <span>✔ Ensuring responsiveness...</span><br />
                                <span className="text-white mt-2 block">Done! Preview ready below.</span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
