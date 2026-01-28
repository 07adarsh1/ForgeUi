import React from 'react';

const LandingNavbar = () => {
    return (
        <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-sm bg-black/10 border-b border-white/5">
            <div className="text-xl font-bold tracking-tight">Forge<span className="text-purple-400">UI</span></div>
        </nav>
    );
};

export default LandingNavbar;
