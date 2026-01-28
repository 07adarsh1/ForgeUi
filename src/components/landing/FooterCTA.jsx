import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';

const FooterCTA = () => {
    const navigate = useNavigate();
    return (
        <section className="py-20 md:py-32 px-6 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to build faster?</h2>
                <p className="text-gray-400 mb-10 text-lg">
                    Join thousands of developers using ForgeUI to speed up their workflow. No credit card required.
                </p>
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => navigate('/generate')}
                        className="h-14 px-10 rounded-full bg-white text-black text-lg font-bold hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 flex items-center gap-2"
                    >
                        Start Generating Free <IoArrowForward />
                    </button>
                    <span className="text-xs text-gray-500 uppercase tracking-widest mt-4">No signup required</span>
                </div>
            </div>
        </section>
    );
};

export default FooterCTA;
