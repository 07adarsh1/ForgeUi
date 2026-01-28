import React from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';

const ComparisonSection = () => {
    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Before */}
                <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
                    <h3 className="text-2xl font-bold mb-6 text-red-200">The Old Way</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 mt-1">✕</span>
                            <span>Searching for "Tailwind navbar snippet" on Google</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 mt-1">✕</span>
                            <span>Manually tweaking padding, margins, and colors</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 mt-1">✕</span>
                            <span>Implementing responsive behavior from scratch</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-red-400 mt-1">✕</span>
                            <span>Wasting hours on boilerplate code</span>
                        </li>
                    </ul>
                </div>

                {/* After */}
                <div className="p-8 rounded-3xl bg-green-500/5 border border-green-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-green-500/10 rounded-bl-2xl border-b border-l border-green-500/20 text-green-300 text-xs font-bold uppercase tracking-wider">
                        ForgeUI Advantage
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-green-200">The ForgeUI Way</h3>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex items-start gap-3">
                            <IoCheckmarkCircle className="text-green-400 text-xl mt-0.5" />
                            <span>Type "Responsive Navbar" → Get Code in 3s</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <IoCheckmarkCircle className="text-green-400 text-xl mt-0.5" />
                            <span>Clean, semantic HTML & Tailwind classes automatically</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <IoCheckmarkCircle className="text-green-400 text-xl mt-0.5" />
                            <span>Fully responsive and accessible by default</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <IoCheckmarkCircle className="text-green-400 text-xl mt-0.5" />
                            <span>More time for logic, less time on pixels</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ComparisonSection;
