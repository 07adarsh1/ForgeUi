import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { formOptions } from '../lib/constants';

export const useHistory = (setPrompt, setGeneratedCode, setFrameWork, setMode, setOutputScreen, setTab) => {
    const [history, setHistory] = useState([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    useEffect(() => {
        const savedHistory = localStorage.getItem('forgeui_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    useEffect(() => {
        localStorage.setItem('forgeui_history', JSON.stringify(history));
    }, [history]);

    const addToHistory = (newPrompt, newCode, frameWorkVal) => {
        const newItem = {
            id: Date.now(),
            prompt: newPrompt,
            code: newCode,
            framework: frameWorkVal,
            date: new Date().toISOString()
        };
        setHistory(prev => [newItem, ...prev]);
    };

    const clearHistory = () => {
        setHistory([]);
        toast.info("History cleared");
    };

    const loadHistoryItem = (item) => {
        setPrompt(item.prompt);
        setGeneratedCode(item.code);
        const fw = formOptions.find(o => o.value === item.framework) || formOptions[1];
        setFrameWork(fw);
        setMode('create');
        setOutputScreen(true);
        setTab(2); // Preview tab
        setIsHistoryOpen(false);
        toast.success("Loaded from history");
    };

    return {
        history,
        isHistoryOpen,
        setIsHistoryOpen,
        addToHistory,
        clearHistory,
        loadHistoryItem
    };
};
