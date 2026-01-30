import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import FileExplorer from '../components/library/FileExplorer';
import LibraryEditor from '../components/library/LibraryEditor';
import { libraryService } from '../lib/db';
import { toast } from 'react-toastify';
import { IoSaveOutline, IoDownloadOutline, IoTrashOutline, IoMenu, IoClose } from 'react-icons/io5';
import { exportComponentAsZip } from '../lib/export';
import { ClipLoader } from 'react-spinners';

const Library = () => {
    const [components, setComponents] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // { content, path, componentId, originalPath, name }
    const [editorContent, setEditorContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, componentId: null });
    const [isUnsaved, setIsUnsaved] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Auto-close sidebar on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const handleDeleteClick = (componentId) => {
        setDeleteModal({ isOpen: true, componentId });
    };

    const confirmDelete = async () => {
        const { componentId } = deleteModal;
        if (!componentId) return;

        try {
            await libraryService.deleteComponent(componentId);
            setComponents(prev => prev.filter(c => c.id !== componentId));
            if (selectedFile?.componentId === componentId) {
                setSelectedFile(null);
                setEditorContent("");
            }
            toast.success("Component deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete component");
        } finally {
            setDeleteModal({ isOpen: false, componentId: null });
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
        <div className="flex flex-col h-screen bg-[#09090b] text-white overflow-hidden">
            <Navbar />

            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Toggle Button */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="absolute top-3 left-4 z-20 p-2 bg-[#18181b] border border-white/10 rounded-lg text-gray-400 hover:text-white md:hidden"
                    >
                        <IoMenu size={20} />
                    </button>
                )}

                {/* Left Sidebar: File Explorer */}
                <div
                    className={`
                        absolute md:relative z-30 h-full
                        w-64 flex-shrink-0 border-r border-white/10 bg-[#09090b]/95 backdrop-blur-xl transition-all duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden'}
                    `}
                >
                    <div className="flex items-center justify-between p-2 md:hidden">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Library</span>
                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-gray-400 hover:text-white">
                            <IoClose size={20} />
                        </button>
                    </div>

                    <div className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 h-full`}>
                        <FileExplorer
                            components={components}
                            onSelectFile={handleFileSelect}
                            selectedFile={selectedFile?.path}
                            onDeleteComponent={handleDeleteClick}
                            onClose={() => setIsSidebarOpen(false)}
                        />
                    </div>
                </div>

                {/* Sidebar Re-open Button (Desktop) */}
                {!isSidebarOpen && (
                    <div className="hidden md:flex flex-col items-center border-r border-white/10 bg-[#09090b] w-10 py-4 gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                            title="Open Sidebar"
                        >
                            <IoMenu size={20} />
                        </button>
                    </div>
                )}

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
                                <button
                                    onClick={() => handleDeleteClick(selectedFile.componentId)}
                                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs"
                                    title="Delete Component"
                                >
                                    <IoTrashOutline /> Delete
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

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Component?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Are you sure you want to delete this component? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, componentId: null })}
                                className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
