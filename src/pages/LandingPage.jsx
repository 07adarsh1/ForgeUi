import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsArrowRight } from 'react-icons/bs';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">

            {/* Minimal Background Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">

                {/* Minimal Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <span className="px-3 py-1 text-xs font-medium tracking-widest text-purple-300 uppercase bg-purple-900/30 rounded-full border border-purple-500/20 backdrop-blur-sm">
                        Powered by Gemini 2.0
                    </span>
                </motion.div>

                {/* Hero Title */}
                {/* Hero Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-8xl font-bold tracking-tight text-center mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 leading-[1.1] pb-2"
                >
                    Design. Generate. <br />
                    <span className="italic font-serif text-5xl md:text-7xl text-purple-400 font-light mt-4 inline-block">Instantly.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-gray-400 max-w-lg text-center leading-relaxed mb-10 font-light"
                >
                    Describe your component. We write the code. <br />
                    Minimal effort, maximum aesthetic.
                </motion.p>

                {/* Minimal Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <button
                        onClick={() => navigate('/generate')}
                        className="group flex items-center gap-3 px-8 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                    >
                        Start Creating
                        <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/docs')}
                        className="flex items-center gap-3 px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all text-sm font-medium backdrop-blur-md"
                    >
                        Documentation
                    </button>
                </motion.div>



            </div>
        </div>
    );
};

export default LandingPage;
