import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const EditSectionModal = ({ section, onSave, onClose }) => {
    const [localSection, setLocalSection] = useState(null);

    // Clone section into local state on mount
    useEffect(() => {
        if (section) {
            // Deep clone to safely edit nested arrays (like features/plans)
            setLocalSection(JSON.parse(JSON.stringify(section)));
        }
    }, [section]);

    if (!localSection) return null;

    const handleChange = (field, value) => {
        setLocalSection(prev => ({
            ...prev,
            props: {
                ...prev.props,
                [field]: value
            }
        }));
    };

    const handleArrayChange = (arrayName, index, field, value) => {
        setLocalSection(prev => {
            const newArray = [...(prev.props[arrayName] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return {
                ...prev,
                props: { ...prev.props, [arrayName]: newArray }
            };
        });
    };

    const handleArrayStringChange = (arrayName, itemIndex, stringIndex, value) => {
        setLocalSection(prev => {
            const newArray = [...(prev.props[arrayName] || [])];
            const newStrings = [...(newArray[itemIndex].features || [])];
            newStrings[stringIndex] = value;
            newArray[itemIndex] = { ...newArray[itemIndex], features: newStrings };
            return {
                ...prev,
                props: { ...prev.props, [arrayName]: newArray }
            };
        });
    }

    const addFeature = () => {
        setLocalSection(prev => ({
            ...prev,
            props: {
                ...prev.props,
                features: [
                    ...(prev.props.features || []),
                    { title: "New Feature", description: "Description goes here.", icon: "fa-bolt" }
                ]
            }
        }));
    };

    const removeFeature = (index) => {
        setLocalSection(prev => {
            const newFeatures = [...(prev.props.features || [])];
            newFeatures.splice(index, 1);
            return {
                ...prev,
                props: { ...prev.props, features: newFeatures }
            };
        });
    };

    const renderFields = () => {
        const { type, props } = localSection;

        if (type === 'Hero') {
            return (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Headline</label>
                        <input
                            type="text"
                            value={props.headline || ''}
                            onChange={(e) => handleChange('headline', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 placeholder:text-white/40"
                            placeholder="Enter headline..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Subheadline</label>
                        <textarea
                            value={props.subheadline || ''}
                            onChange={(e) => handleChange('subheadline', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 placeholder:text-white/40 min-h-[80px]"
                            placeholder="Enter subheadline..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Primary CTA</label>
                            <input
                                type="text"
                                value={props.primaryCTA || props.ctaText || ''}
                                onChange={(e) => handleChange('primaryCTA', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 placeholder:text-white/40"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Secondary CTA</label>
                            <input
                                type="text"
                                value={props.secondaryCTA || props.secondaryButton || ''}
                                onChange={(e) => handleChange('secondaryCTA', e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 placeholder:text-white/40"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (type === 'Features') {
            const features = props.features || [];
            return (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Section Title</label>
                        <input
                            type="text"
                            value={props.sectionTitle || ''}
                            onChange={(e) => handleChange('sectionTitle', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 placeholder:text-white/40"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs text-white/60 uppercase tracking-wider">Features List</label>
                            <button onClick={addFeature} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Feature</button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                            {features.map((f, i) => (
                                <div key={i} className="p-4 border border-white/5 rounded-lg bg-black/20 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-white/40">Feature {i + 1}</span>
                                        <button onClick={() => removeFeature(i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                                    </div>
                                    <input
                                        type="text"
                                        value={f.title || ''}
                                        onChange={(e) => handleArrayChange('features', i, 'title', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                        placeholder="Feature Title"
                                    />
                                    <textarea
                                        value={f.description || ''}
                                        onChange={(e) => handleArrayChange('features', i, 'description', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 min-h-[60px]"
                                        placeholder="Feature Description"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (type === 'Pricing') {
            const plans = props.plans || [];
            return (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">Section Title</label>
                        <input
                            type="text"
                            value={props.sectionTitle || ''}
                            onChange={(e) => handleChange('sectionTitle', e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20 placeholder:text-white/40"
                        />
                    </div>

                    <div className="max-h-[350px] overflow-y-auto space-y-4 pr-2">
                        {plans.map((p, i) => (
                            <div key={i} className="p-4 border border-white/5 rounded-lg bg-black/20 space-y-3">
                                <span className="text-xs font-medium text-white/40">Plan {i + 1}</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={p.name || ''}
                                        onChange={(e) => handleArrayChange('plans', i, 'name', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                        placeholder="Plan Name"
                                    />
                                    <input
                                        type="text"
                                        value={p.price || ''}
                                        onChange={(e) => handleArrayChange('plans', i, 'price', e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                        placeholder="Price (e.g., $19)"
                                    />
                                </div>

                                <div className="space-y-2 mt-2">
                                    <label className="block text-xs text-white/50">Features</label>
                                    {(p.features || []).map((feat, fIdx) => (
                                        <input
                                            key={fIdx}
                                            type="text"
                                            value={feat}
                                            onChange={(e) => handleArrayStringChange('plans', i, fIdx, e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/20"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Add generic fallback for other sections
        return (
            <div className="p-4 border border-white/10 rounded-lg bg-black/20 text-center text-sm text-white/60">
                Generic editing for {type} sections coming soon.
            </div>
        );
    };

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
                    className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]"
                    onClick={e => e.stopPropagation()} // trap clicks
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-white">Edit {localSection.type} Section</h2>
                            <p className="text-xs text-white/50 mt-1">Make changes to the content below.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/40 hover:text-white transition-colors p-1"
                        >
                            <IoClose size={20} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto mb-6 minimal-scrollbar">
                        {renderFields()}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-auto">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(localSection)}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-white/90 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditSectionModal;
