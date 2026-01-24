import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoArrowBack, IoRocketOutline, IoFlashOutline, IoCodeSlashOutline, IoExtensionPuzzleOutline } from 'react-icons/io5';

const Documentation = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Concept",
            content: "GenUI translates natural language into production-ready frontend code. It bridges the gap between design and implementation using advanced AI models.",
            icon: <IoRocketOutline />
        },
        {
            title: "Speed",
            content: "Designed for rapid prototyping. Skip the boilerplate and focus on the logic. Generate complex layouts in seconds, not hours.",
            icon: <IoFlashOutline />
        },
        {
            title: "Technology",
            content: "Powered by Gemini 2.5 Flash. The engine understands modern UI patterns, Tailwind CSS utility classes, and semantic HTML structure.",
            icon: <IoCodeSlashOutline />
        },
        {
            title: "Features",
            content: "Instant live preview, history tracking, responsive design generation, and one-click export. A complete environment for UI iteration.",
            icon: <IoExtensionPuzzleOutline />
        }
    ];

    return (
        <div className="min-h-screen text-white flex flex-col items-center py-20 px-6 relative overflow-hidden font-sans">

            {/* Background Spotlights */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2" />

            <div className="max-w-3xl w-full relative z-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-16">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <IoArrowBack className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <span className="text-xs font-medium tracking-widest text-purple-300 uppercase bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/10">
                        Docs v1.0
                    </span>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Documentation
                    </h1>
                    <p className="text-lg text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
                        Understanding how GenUI empowers your workflow. <br /> Simple. Powerful. Intelligent.
                    </p>
                </motion.div>

                {/* Minimal Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl text-gray-300 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/10 group-hover:text-white">
                                {section.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-white">{section.title}</h3>
                            <p className="text-gray-400 font-light leading-relaxed text-sm">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Documentation;
