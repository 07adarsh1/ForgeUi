import React from 'react';
import { IoCloseSharp, IoTrash } from 'react-icons/io5';

const HistorySidebar = ({ isOpen, onClose, history, onSelect, onClear }) => {
    return (
        <div className={`fixed top-0 right-0 h-full w-[350px] bg-[#141319] shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-gray-800`}>
            <div className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">History</h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        <IoCloseSharp className="text-xl text-gray-400" />
                    </button>
                </div>

                {history.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <p>No history yet</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => onSelect(item)}
                                className="p-4 rounded-xl bg-[#09090B] border border-zinc-900 hover:border-purple-500 cursor-pointer transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-purple-400 font-medium px-2 py-1 bg-purple-500/10 rounded-md">
                                        {item.framework}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-white transition-colors">
                                    {item.prompt}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {history.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                        <button
                            onClick={onClear}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-medium"
                        >
                            <IoTrash /> Clear History
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorySidebar;
