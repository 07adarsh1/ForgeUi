import React from 'react';
import Editor from '@monaco-editor/react';

const LibraryEditor = ({ file, code, onChange }) => {
    if (!file) {
        return (
            <div className="flex h-full items-center justify-center text-gray-500">
                <p>Select a file to edit</p>
            </div>
        );
    }

    // Determine language based on file extension
    const getLanguage = (fileName) => {
        if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) return 'typescript';
        if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) return 'javascript';
        if (fileName.endsWith('.json')) return 'json';
        if (fileName.endsWith('.html')) return 'html';
        if (fileName.endsWith('.css')) return 'css';
        return 'plaintext';
    };

    return (
        <div className="h-full w-full bg-[#1e1e1e]">
            <Editor
                path={file.path} // Helps Monaco with intellisense context
                value={code}
                language={getLanguage(file.name)}
                theme="vs-dark"
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                }}
            />
        </div>
    );
};

export default LibraryEditor;
