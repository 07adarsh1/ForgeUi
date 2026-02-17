
import React, { useState, useRef } from 'react';
import { IoImage, IoClose, IoCloudUpload, IoSparkles } from 'react-icons/io5';
import { ClipLoader } from 'react-spinners';

const ScreenshotInput = ({ onAnalyze, loading }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    };

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file (PNG, JPG)");
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const clearImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleGenerate = () => {
        if (selectedFile) {
            onAnalyze(selectedFile);
        }
    };

    return (
        <>
            <div className="mb-6">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Screenshot to UI.
                </h2>
                <p className="text-gray-400 mt-2 font-light">
                    Upload a screenshot. We'll rebuild it in React + Tailwind.
                </p>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                {!previewUrl ? (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex-1 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer group
              ${isDragging
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/10 hover:border-white/20 hover:bg-white/5 bg-black/20'
                            }`}
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <IoCloudUpload className="text-3xl text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                        <p className="text-gray-300 font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-gray-500 text-sm">PNG, JPG (max 5MB)</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                ) : (
                    <div className="relative flex-1 bg-black/40 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center group">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-[400px] max-w-full object-contain"
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); clearImage(); }}
                            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500/80 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <IoClose size={20} />
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading || !selectedFile}
                className="mt-6 w-full py-4 rounded-xl font-medium text-black bg-white hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <ClipLoader color='#000' size={20} /> : <IoSparkles className="text-lg" />}
                {loading ? "Analyzing Layout..." : "Generate Component"}
            </button>
        </>
    );
};

export default ScreenshotInput;
