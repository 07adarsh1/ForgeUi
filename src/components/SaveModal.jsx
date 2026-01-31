
import { IoClose, IoSaveOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import React from 'react';

const SaveModal = ({ isOpen, onClose, checkNameAvailability, onSave, initialName = "", initialTags = "" }) => {
    const [name, setName] = useState(initialName);
    const [tags, setTags] = useState(initialTags);
    const [errorModel, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setTags(initialTags);
            setError(null);
        }
    }, [isOpen, initialName, initialTags]);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Name cannot be empty");
            return;
        }

        // Basic validation
        if (/[^a-zA-Z0-9\s\-_]/.test(name)) {
            setError("Name contains invalid characters (use letters, numbers, spaces, - or _)");
            return;
        }

        onSave(name, tags);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-white font-semibold text-lg">Save to Library</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <IoClose size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-6">

                    {/* Component Name Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">
                            Component Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError(null);
                            }}
                            autoFocus
                            placeholder="e.g. Pricing Card Glass"
                            className={`w-full bg-black/20 border ${errorModel ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/20'} rounded-xl p-3 text-white placeholder-gray-600 outline-none transition-all`}
                        />
                        {errorModel && (
                            <span className="text-xs text-red-400 ml-1">{errorModel}</span>
                        )}
                        <p className="text-[10px] text-gray-500 ml-1">
                            Folder name will be: <span className="font-mono text-gray-400">{name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}</span>
                        </p>
                    </div>

                    {/* Tags Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold ml-1">
                            Tags (Optional)
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="card, glassmorphism, pricing"
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 outline-none focus:border-white/20 transition-all"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg shadow-white/5"
                    >
                        <IoSaveOutline />
                        Save Component
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SaveModal;
