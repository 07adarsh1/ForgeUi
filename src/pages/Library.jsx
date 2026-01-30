import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import FileExplorer from '../components/library/FileExplorer';
import LibraryEditor from '../components/library/LibraryEditor';
import { libraryService } from '../lib/db';
import { toast } from 'react-toastify';
import { IoSaveOutline, IoDownloadOutline } from 'react-icons/io5';
import { exportComponentAsZip } from '../lib/export';
import { ClipLoader } from 'react-spinners';

const Library = () => {
    const [components, setComponents] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // { content, path, componentId, originalPath, name }
    const [editorContent, setEditorContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [isUnsaved, setIsUnsaved] = useState(false);

    useEffect(() => {
        loadComponents();
    }, []);

    const loadComponents = async () => {
        try {
            setIsLoading(true);
            const data = await libraryService.getAllComponents();
            setComponents(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load library");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (fileNode) => {
        if (isUnsaved) {
            if (!confirm("You have unsaved changes. Discard them?")) return;
        }

        setSelectedFile(fileNode);
        setEditorContent(fileNode.content);
        setIsUnsaved(false);
    };

    const handleEditorChange = (value) => {
        setEditorContent(value);
        setIsUnsaved(value !== selectedFile?.content);
    };

    const saveFile = async () => {
        if (!selectedFile) return;

        try {
            const component = await libraryService.getComponentById(selectedFile.componentId);
            if (!component) throw new Error("Component not found");

            // Update the specific file
            component.files[selectedFile.originalPath] = editorContent;

            // Update meta if needed (e.g. lastModified) - optional
            // component.meta.lastModified = new Date().toISOString(); 

            await libraryService.saveComponent(component);

            // Update local state
            setSelectedFile(prev => ({ ...prev, content: editorContent }));
            setIsUnsaved(false);

            // Refresh list (lightweight)
            const updatedComponents = components.map(c => c.id === component.id ? component : c);
            setComponents(updatedComponents);

            toast.success("File saved");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save file");
        }
    };

    const handleExport = async () => {
        if (!selectedFile) return;

        try {
            setIsExporting(true);
            const component = await libraryService.getComponentById(selectedFile.componentId);
            if (!component) throw new Error("Component not found");

            await exportComponentAsZip(component);
            toast.success("Exported ZIP successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to export ZIP");
        } finally {
            setIsExporting(false);
        }
    };

    // Keyboard shortcut for saving
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveFile();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedFile, editorContent]);

    return (
        <div className="flex flex-col h-screen bg-black text-white overflow-hidden">
            <Navbar />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: File Explorer */}
                <div className="w-64 flex-shrink-0 border-r border-white/10 bg-[#18181b]">
                    <FileExplorer
                        components={components}
                        onSelectFile={handleFileSelect}
                        selectedFile={selectedFile?.path}
                    />
                </div>

                {/* Right Panel: Editor */}
                <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                    {/* Editor Header / Tabs */}
                    <div className="flex items-center justify-between h-9 bg-[#18181b] border-b border-white/10 px-4">
                        <span className="text-xs text-gray-400 font-mono">
                            {selectedFile ? selectedFile.path : 'No file selected'} {isUnsaved && '●'}
                        </span>
                        {selectedFile && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs disabled:opacity-50"
                                    title="Export ZIP"
                                >
                                    {isExporting ? <ClipLoader size={12} color="#fff" /> : <IoDownloadOutline />} Export
                                </button>
                                <button
                                    onClick={saveFile}
                                    className={`text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs ${isUnsaved ? 'text-purple-400' : ''}`}
                                    title="Save (Ctrl+S)"
                                >
                                    <IoSaveOutline /> Save
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 relative">
                        <LibraryEditor
                            file={selectedFile}
                            code={editorContent}
                            onChange={handleEditorChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;
