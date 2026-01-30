import React, { useState, useMemo } from 'react';
import {
    IoChevronDown,
    IoChevronForward,
    IoFolderOpen,
    IoFolder,
    IoDocumentText,
    IoLogoReact,
    IoRefresh,
    IoTrashOutline
} from 'react-icons/io5';
import { SiTypescript, SiJavascript } from 'react-icons/si';

// Icon helper
const getFileIcon = (fileName) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return <IoLogoReact className="text-blue-400" />;
    if (fileName.endsWith('.ts') || fileName.endsWith('.js')) return <SiTypescript className="text-blue-500" />;
    if (fileName.endsWith('.json')) return <span className="text-yellow-400 font-bold text-xs">{'{ }'}</span>;
    return <IoDocumentText className="text-gray-400" />;
};

const FileTreeNode = ({ node, level, onSelect, selectedFile, expandedFolders, toggleFolder, onDelete }) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;

    if (node.type === 'file') {
        return (
            <div
                className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-white/10 transition-colors ${isSelected ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                style={{ paddingLeft: `${level * 16 + 12}px` }}
                onClick={() => onSelect(node)}
            >
                {getFileIcon(node.name)}
                <span className="text-sm truncate">{node.name}</span>
            </div>
        );
    }

    return (
        <div>
            <div
                className={`flex items-center gap-1 py-1 px-2 cursor-pointer hover:bg-white/5 transition-colors text-gray-300 font-medium group justify-between`}
                style={{ paddingLeft: `${level * 16}px` }}
                onClick={() => toggleFolder(node.path)}
            >
                <div className="flex items-center gap-1 overflow-hidden">
                    <span className="text-gray-500">
                        {isExpanded ? <IoChevronDown /> : <IoChevronForward />}
                    </span>
                    {isExpanded ? <IoFolderOpen className="text-purple-400" /> : <IoFolder className="text-purple-400" />}
                    <span className="text-sm truncate select-none">{node.name}</span>
                </div>
                {level === 0 && onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(node.componentId); }}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1"
                        title="Delete Component"
                    >
                        <IoTrashOutline />
                    </button>
                )}
            </div>
            {isExpanded && node.children.map((child) => (
                <FileTreeNode
                    key={child.path}
                    node={child}
                    level={level + 1}
                    onSelect={onSelect}
                    selectedFile={selectedFile}
                    expandedFolders={expandedFolders}
                    toggleFolder={toggleFolder}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

const FileExplorer = ({ components, onSelectFile, selectedFile, onRefresh, onDeleteComponent }) => {
    const [expandedFolders, setExpandedFolders] = useState(new Set());

    const toggleFolder = (path) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    };

    // Convert generic record to directory tree
    const treeData = useMemo(() => {
        const root = [];

        components.forEach((comp) => {
            const rootFolder = {
                name: comp.folderName,
                path: comp.folderName,
                type: 'folder',
                componentId: comp.id,
                children: []
            };

            // Process files
            Object.keys(comp.files).forEach((filePath) => {
                const parts = filePath.split('/');
                let currentLevel = rootFolder.children;
                let currentPath = comp.folderName;

                parts.forEach((part, index) => {
                    currentPath += `/${part}`;
                    const isFile = index === parts.length - 1;

                    if (isFile) {
                        currentLevel.push({
                            name: part,
                            path: currentPath,
                            type: 'file',
                            content: comp.files[filePath],
                            componentId: comp.id,
                            originalPath: filePath
                        });
                    } else {
                        let folder = currentLevel.find(f => f.name === part && f.type === 'folder');
                        if (!folder) {
                            folder = {
                                name: part,
                                path: currentPath,
                                type: 'folder',
                                children: []
                            };
                            currentLevel.push(folder);
                        }
                        currentLevel = folder.children;
                    }
                });
            });

            // Sort: folders first, then files
            const sortNodes = (nodes) => {
                nodes.sort((a, b) => {
                    if (a.type === b.type) return a.name.localeCompare(b.name);
                    return a.type === 'folder' ? -1 : 1;
                });
                nodes.forEach(n => {
                    if (n.children) sortNodes(n.children);
                });
            };

            sortNodes(rootFolder.children);
            root.push(rootFolder);
        });

        return root;
    }, [components]);

    return (
        <div className="flex flex-col h-full bg-[#18181b] border-r border-white/10 select-none overflow-y-auto">
            <div className="p-4 uppercase text-xs font-bold text-gray-500 tracking-wider flex items-center justify-between">
                <span>Explorer</span>
                <button onClick={onRefresh} className="hover:text-white transition-colors" title="Refresh Library">
                    <IoRefresh size={14} />
                </button>
            </div>
            <div className="flex-1">
                {treeData.length === 0 ? (
                    <div className="text-gray-600 text-sm text-center mt-10 p-4">
                        Library is empty.<br />Save a component to get started.
                    </div>
                ) : (
                    treeData.map(node => (
                        <FileTreeNode
                            key={node.path}
                            node={node}
                            level={0}
                            onSelect={onSelectFile}
                            selectedFile={selectedFile}
                            expandedFolders={expandedFolders}
                            toggleFolder={toggleFolder}
                            onDelete={onDeleteComponent}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default FileExplorer;
