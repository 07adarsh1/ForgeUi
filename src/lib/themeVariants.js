export const themeVariants = {
    minimal: {
        background: "bg-[#0a0a0a]",
        sectionAlt: "bg-[#111111]",
        primaryBtn: "bg-white text-black font-medium hover:bg-gray-200 rounded-full",
        secondaryBtn: "bg-transparent text-gray-400 font-medium hover:text-white border border-white/10 rounded-full",
        headingWeight: "font-medium tracking-tight text-gray-100",
        textMuted: "text-gray-500 font-light",
        border: "border-white/5",
        accentGlow: "bg-white/5",
        cardBg: "bg-[#111] border-white/5 hover:bg-[#161616]",
        layoutMode: "centered" // preferred layout
    },
    bold: {
        background: "bg-black",
        sectionAlt: "bg-zinc-950",
        primaryBtn: "bg-indigo-600 text-white font-bold uppercase tracking-wider hover:bg-indigo-500 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]",
        secondaryBtn: "bg-transparent border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black",
        headingWeight: "font-black tracking-tighter uppercase text-white",
        textMuted: "text-gray-300 font-medium",
        border: "border-white/20",
        accentGlow: "bg-indigo-500/20",
        cardBg: "bg-black border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]",
        layoutMode: "two-column"
    },
    enterprise: {
        background: "bg-slate-950",
        sectionAlt: "bg-slate-900 border-y border-slate-800",
        primaryBtn: "bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-900/20 rounded-lg",
        secondaryBtn: "bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 rounded-lg",
        headingWeight: "font-bold tracking-tight text-slate-50",
        textMuted: "text-slate-400",
        border: "border-slate-800",
        accentGlow: "bg-blue-600/20",
        cardBg: "bg-slate-900 border-slate-800 hover:bg-slate-800",
        layoutMode: "two-column"
    }
};

export const layoutDensities = {
    comfortable: {
        sectionPadding: "py-24 md:py-32",
        containerWidth: "max-w-7xl",
        gridGap: "gap-12 md:gap-16",
        textSpacing: "mb-8 md:mb-10",
        ctaSpacing: "mt-10 md:mt-12",
        cardPadding: "p-8 md:p-10"
    },
    compact: {
        sectionPadding: "py-12 md:py-16",
        containerWidth: "max-w-5xl",
        gridGap: "gap-6 md:gap-8",
        textSpacing: "mb-4 md:mb-6",
        ctaSpacing: "mt-6 md:mt-8",
        cardPadding: "p-5 md:p-6"
    }
};
