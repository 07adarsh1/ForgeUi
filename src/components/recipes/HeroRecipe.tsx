import React from 'react';

export interface HeroRecipeProps {
    layout?: 'centered' | 'two-column';
    headline: string;
    subheadline: string;
    primaryCTA: string;
    secondaryCTA?: string;
    tagline?: string;
}

export const HeroRecipe: React.FC<HeroRecipeProps> = ({
    layout = 'centered',
    headline,
    subheadline,
    primaryCTA,
    secondaryCTA,
    tagline
}) => {
    return (
        <section className="relative overflow-hidden bg-black text-white py-24 md:py-32">
            {/* Background subtle radial glow */}
            <div className="absolute inset-x-0 top-0 -z-10 flex justify-center opacity-30 pointer-events-none">
                <div className="w-[800px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {layout === 'two-column' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

                        {/* Left Content */}
                        <div className="flex flex-col items-start text-left">
                            {tagline && (
                                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-300 mb-6 backdrop-blur-md">
                                    {tagline}
                                </span>
                            )}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                                {headline}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                                {subheadline}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200">
                                    {primaryCTA}
                                </button>
                                {secondaryCTA && (
                                    <button className="px-8 py-4 bg-transparent border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors duration-200">
                                        {secondaryCTA}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Visual Placeholder */}
                        <div className="w-full aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <p className="text-gray-500 font-medium">Visual Content</p>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                        {/* Centered Content */}
                        {tagline && (
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-300 mb-8 backdrop-blur-md">
                                {tagline}
                            </span>
                        )}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-8">
                            {headline}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
                            {subheadline}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                            <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200">
                                {primaryCTA}
                            </button>
                            {secondaryCTA && (
                                <button className="px-8 py-4 bg-transparent border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors duration-200">
                                    {secondaryCTA}
                                </button>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </section>
    );
};
