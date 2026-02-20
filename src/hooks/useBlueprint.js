import { useState, useEffect } from 'react';
import { generatePageCode } from '../lib/recipes';
import { generatePreviewHtml } from '../lib/preview';
import { formOptions } from '../lib/constants';

export const useBlueprint = (setGeneratedCode, setFrameWork, setPreviewHtml) => {
    const [activeBlueprint, setActiveBlueprint] = useState(null);
    const [originalBlueprint, setOriginalBlueprint] = useState(null);
    const [editingSectionIndex, setEditingSectionIndex] = useState(null);
    const [addingSectionIndex, setAddingSectionIndex] = useState(null);

    const updateBlueprint = (newBlueprint) => {
        setActiveBlueprint(newBlueprint);
        const pageCode = generatePageCode(newBlueprint);
        setGeneratedCode(pageCode);
        const reactFw = formOptions.find(o => o.value === 'react-tailwind');
        setFrameWork(reactFw);
        setPreviewHtml(generatePreviewHtml(pageCode, 'react-tailwind'));
    };

    useEffect(() => {
        const handleIframeMessage = (e) => {
            let { type, index } = e.data || {};
            if (!type) return;

            index = Number(index);

            if (type === 'EDIT_SECTION') {
                setEditingSectionIndex(index);
            } else if (type === 'OPEN_ADD_MODAL') {
                setAddingSectionIndex(index);
            } else if (type === 'DELETE_SECTION') {
                if (!activeBlueprint) return;
                const newBlueprint = { ...activeBlueprint };
                newBlueprint.sections = newBlueprint.sections.filter((_, i) => i !== index);
                updateBlueprint(newBlueprint);
            } else if (type === 'REGENERATE_SECTION') {
                if (!activeBlueprint || !originalBlueprint) return;
                const newBlueprint = { ...activeBlueprint };
                newBlueprint.sections = [...newBlueprint.sections];
                const targetId = newBlueprint.sections[index]?.id;
                const origSection = originalBlueprint.sections.find(s => s.id === targetId);
                if (origSection) {
                    newBlueprint.sections[index] = JSON.parse(JSON.stringify(origSection));
                    updateBlueprint(newBlueprint);
                }
            }
        };

        window.addEventListener('message', handleIframeMessage);
        return () => window.removeEventListener('message', handleIframeMessage);
    }, [activeBlueprint, originalBlueprint]);

    const handleSaveSection = (updatedSection) => {
        if (activeBlueprint !== null && editingSectionIndex !== null) {
            const newBlueprint = { ...activeBlueprint };
            newBlueprint.sections[editingSectionIndex] = updatedSection;
            updateBlueprint(newBlueprint);
            setEditingSectionIndex(null);
        }
    };

    const handleAddSection = (sectionConfig) => {
        if (activeBlueprint !== null && addingSectionIndex !== null) {
            const newBlueprint = { ...activeBlueprint };

            const newSection = {
                id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                type: sectionConfig.type,
                props: JSON.parse(JSON.stringify(sectionConfig.defaultProps))
            };

            newBlueprint.sections.splice(addingSectionIndex, 0, newSection);
            updateBlueprint(newBlueprint);
            setAddingSectionIndex(null);
        }
    };

    return {
        activeBlueprint,
        setActiveBlueprint,
        originalBlueprint,
        setOriginalBlueprint,
        editingSectionIndex,
        setEditingSectionIndex,
        addingSectionIndex,
        setAddingSectionIndex,
        handleSaveSection,
        handleAddSection,
        updateBlueprint
    };
};
