import React from 'react';

const ShowcaseGrid = () => {
    const examples = [
        { title: "Dashboard Cards", prompt: "Dark mode analytics card with a line chart and stats", image: "/dashboard_preview.png" },
        { title: "Landing Hero", prompt: "Hero section with large heading, two buttons and an image placeholder", image: "/hero_preview.png" },
        { title: "Authentication", prompt: "Minimalist login form with glassmorphism effect", image: "/auth_preview.png" },
        { title: "Ecommerce", prompt: "Product card with image, price, badge and add to cart button", image: "/ecommerce_preview.png" }
    ];

    return (
        <section className="py-20 px-6 border-y border-white/5 bg-black/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Build anything instantly</h2>
                    <p className="text-gray-400">From small components to full page sections.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {examples.map((item, idx) => (
                        <div key={idx} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:translate-y-[-5px]">
                            {/* Visual Preview */}
                            <div className="h-48 w-full bg-gray-900 flex items-center justify-center relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                            </div>

                            <div className="p-5">
                                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                                <div className="text-xs text-gray-500 font-mono bg-black/30 p-2 rounded border border-white/5 truncate">
                                    "{item.prompt}"
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShowcaseGrid;
