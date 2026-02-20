import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const SECTIONS = [
    {
        type: 'Hero',
        icon: 'fa-bolt',
        name: 'Hero Section',
        description: 'Main landing area with large headline and CTAs.',
        defaultProps: {
            headline: "Headline goes here",
            subheadline: "A brief, compelling description.",
            ctaText: "Get Started",
            secondaryButton: "Learn More"
        }
    },
    {
        type: 'Features',
        icon: 'fa-layer-group',
        name: 'Features Grid',
        description: 'Showcase your product features in a clean grid layout.',
        defaultProps: {
            sectionTitle: "Features",
            features: [
                { title: "Feature One", description: "Explain your feature here.", icon: "fa-bolt" },
                { title: "Feature Two", description: "Explain your feature here.", icon: "fa-shield" },
                { title: "Feature Three", description: "Explain your feature here.", icon: "fa-rocket" }
            ]
        }
    },
    {
        type: 'Pricing',
        icon: 'fa-money-bill',
        name: 'Pricing Cards',
        description: 'Display simple, clear pricing tiers.',
        defaultProps: {
            sectionTitle: "Pricing",
            plans: [
                { name: "Starter", price: "$19", features: ["1 User", "5 Projects", "Basic Support"] },
                { name: "Pro", price: "$49", features: ["Unlimited Users", "Unlimited Projects", "24/7 Support"] }
            ]
        }
    },
    {
        type: 'Testimonials',
        icon: 'fa-comment',
        name: 'Testimonials',
        description: 'Social proof from your users and customers.',
        defaultProps: {
            sectionTitle: "What people say",
            testimonials: [
                { name: "Alice", role: "CEO", text: "Incredible tool. Saved us hours." },
                { name: "Bob", role: "Designer", text: "The best experience I've had." }
            ]
        }
    },
    {
        type: 'CTA',
        icon: 'fa-location-arrow',
        name: 'Call to Action',
        description: 'A focused, high-conversion strip.',
        defaultProps: {
            headline: "Ready to start?",
            subheadline: "Join thousands of users today.",
            ctaText: "Sign Up Now"
        }
    },
    {
        type: 'Footer',
        icon: 'fa-grip-lines',
        name: 'Footer',
        description: 'Standard bottom navigation and links.',
        defaultProps: {
            companyName: "Your Company",
            links: ["About", "Privacy", "Terms"]
        }
    }
];

const SectionPickerModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="w-full max-w-3xl bg-neutral-900 border border-white/10 rounded-xl p-6 shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-white">Add new section</h2>
                            <p className="text-xs text-white/50 mt-1">Select a component to insert.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/40 hover:text-white transition-colors p-1"
                        >
                            <IoClose size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto minimal-scrollbar pr-2">
                        {SECTIONS.map((sec, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelect(sec)}
                                className="group flex items-start gap-4 p-4 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center border border-white/5 group-hover:border-white/20 shrink-0">
                                    <i className={`fa-solid ${sec.icon} text-white/70 group-hover:text-white transition-colors text-sm`}></i>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white mb-1 group-hover:text-indigo-300 transition-colors">{sec.name}</h3>
                                    <p className="text-xs text-white/50 line-clamp-2">{sec.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SectionPickerModal;
