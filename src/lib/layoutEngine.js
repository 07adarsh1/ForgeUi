
import { FaBeer } from 'react-icons/fa'; // Example import, won't be used in output string but for reference

const sectionRecipes = {
    hero: (layout, elements) => {
        const hasImage = elements.includes('image');

        if (layout === 'two-column') {
            return `
      {/* Hero Section - Two Column */}
      <section className="bg-zinc-900 py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            ${elements.includes('heading') ? '<h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-6">Build Something Amazing</h1>' : ''}
            ${elements.includes('paragraph') ? '<p className="text-gray-400 text-lg mb-8 leading-relaxed">Experience the next generation of digital innovation. Fast, secure, and beautiful by default.</p>' : ''}
            ${elements.includes('button') ? `
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all">Get Started</button>
              <button className="px-8 py-4 bg-zinc-800 text-white font-semibold rounded-full hover:bg-zinc-700 transition-all border border-zinc-700">Learn More</button>
            </div>` : ''}
          </div>
          ${hasImage ? `
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Hero" 
              className="relative rounded-2xl shadow-2xl w-full border border-white/10"
            />
          </div>` : ''}
        </div>
      </section>
      `;
        }

        // Default / Centered
        return `
      {/* Hero Section - Centered */}
      <section className="bg-zinc-950 py-24 text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          ${elements.includes('heading') ? '<h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">Design Without Limits</h1>' : ''}
          ${elements.includes('paragraph') ? '<p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">Create stunning interfaces with our advanced component library. Built for speed and flexibility.</p>' : ''}
          ${elements.includes('button') ? `
          <div className="flex gap-4 justify-center">
             <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-purple-500/30">Start Building</button>
          </div>` : ''}
          ${hasImage ? `
          <div className="mt-16 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80" 
              alt="App Screenshot" 
              className="relative rounded-2xl shadow-2xl border border-white/10 w-full"
            />
          </div>` : ''}
        </div>
      </section>
    `;
    },

    features: (layout, elements) => {
        return `
      {/* Features Section */}
      <section className="bg-zinc-900 py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to build faster and better.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-8 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-2xl transition-all group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                  <i className="fa-solid fa-bolt text-2xl text-purple-400"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Feature Title {item}</h3>
                <p className="text-gray-400">Detailed description of this amazing feature goes here. It explains the value proposition clearly.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    `;
    },

    cta: (layout, elements) => {
        return `
      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-3xl p-12 text-center md:text-left relative overflow-hidden">
             
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
                  <p className="text-gray-400 text-lg">Join thousands of developers building the future today.</p>
               </div>
               <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shrink-0">
                 Get Started Now
               </button>
             </div>
          </div>
        </div>
      </section>
    `;
    },

    footer: (layout, elements) => {
        return `
      {/* Footer */}
      <footer className="bg-zinc-950 py-12 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Features</li>
                <li className="hover:text-white cursor-pointer">Pricing</li>
                <li className="hover:text-white cursor-pointer">Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Company</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                 <li className="hover:text-white cursor-pointer">About</li>
                 <li className="hover:text-white cursor-pointer">Blog</li>
                 <li className="hover:text-white cursor-pointer">Careers</li>
              </ul>
            </div>
             <div>
              <h4 className="text-white font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                 <li className="hover:text-white cursor-pointer">Privacy</li>
                 <li className="hover:text-white cursor-pointer">Terms</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-6">Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for updates.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-purple-500 text-white" />
                <button className="bg-purple-600 px-4 py-2 rounded-lg text-white hover:bg-purple-700 transition-colors">Go</button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
            © 2024 ForgeUI. All rights reserved.
          </div>
        </div>
      </footer>
    `;
    }
};

export const renderFromLayoutSpec = (specStr) => {
    let spec;
    try {
        // Ensure we're parsing JSON even if it's wrapped in markdown blocks
        const cleanJson = specStr.replace(/```json/g, '').replace(/```/g, '').trim();
        spec = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse layout spec", e);
        return null;
    }

    const sectionsCode = spec.sections?.map(section => {
        const layoutType = section.layout || 'default';
        const elements = section.elements || [];
        const renderer = sectionRecipes[section.type] || sectionRecipes.hero; // Default to hero if unknown

        return renderer(layoutType, elements);
    }).join('\n');

    return `
import React from 'react';

export default function GeneratedPage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-purple-500/30">
      ${sectionsCode}
    </div>
  );
}
  `;
};
