import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import DemoSection from '../components/landing/DemoSection';
import ComparisonSection from '../components/landing/ComparisonSection';
import ShowcaseGrid from '../components/landing/ShowcaseGrid';
import ImproveSection from '../components/landing/ImproveSection';
import DeveloperFeatures from '../components/landing/DeveloperFeatures';
import FooterCTA from '../components/landing/FooterCTA';

const LandingPage = () => {
    return (
        <div className="min-h-screen text-white font-sans selection:bg-purple-500/30">
            <LandingNavbar />
            <HeroSection />
            <DemoSection />
            <ComparisonSection />
            <ShowcaseGrid />
            <ImproveSection />
            <DeveloperFeatures />
            <FooterCTA />

            {/* Simple footer content */}
            <footer className="py-8 text-center text-xs text-gray-600 border-t border-white/5 bg-black/40">
                <p>© 2026 ForgeUI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
