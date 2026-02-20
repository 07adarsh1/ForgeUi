import { useState } from 'react';
import { toast } from 'react-toastify';
import { generateWithAI } from '../services/aiService';
import { extractCode } from '../lib/componentUtils';
import { buildEnhancementPrompt } from '../lib/promptEnhancer';
import { getCreationPrompt, getImprovementPrompt } from '../lib/prompts';
import { getFullPageBlueprintPrompt } from '../lib/pagePrompts';
import { generatePageCode } from '../lib/recipes';
import { generatePreviewHtml } from '../lib/preview';
import { formOptions } from '../lib/constants';

export const useAIAction = ({
    prompt, setPrompt, frameWork, setFrameWork, modelProvider,
    setGeneratedCode, setPreviewHtml, addToHistory,
    mode, inputCode, setImprovedCode, customImprovePrompt, setCustomImprovePrompt,
    themeOverride, densityOverride,
    setActiveBlueprint, setOriginalBlueprint,
    setOutputScreen, setTab, setMobileTab
}) => {
    const [loading, setLoading] = useState(false);
    const [enhancing, setEnhancing] = useState(false);

    const enhancePrompt = async () => {
        if (!prompt.trim()) return toast.info("Please enter a basic prompt first");

        try {
            setEnhancing(true);
            const promptImprovement = buildEnhancementPrompt(prompt, frameWork.value);

            const enhancedText = (await generateWithAI(promptImprovement, modelProvider)).trim();
            setPrompt(enhancedText);
            toast.success("Prompt enhanced using AI ✨");
        } catch (error) {
            console.error(error);
            toast.error("Failed to enhance prompt");
        } finally {
            setEnhancing(false);
        }
    };

    const getFullPageBlueprint = async () => {
        if (!prompt.trim()) return toast.error("Please describe your website first");

        try {
            setLoading(true);

            let finalTheme = themeOverride.value;
            let finalDensity = densityOverride.value;

            if (finalTheme === 'auto') {
                const p = prompt.toLowerCase();
                if (p.includes('enterprise') || p.includes('corporate') || p.includes('b2b') || p.includes('healthcare') || p.includes('finance')) {
                    finalTheme = 'enterprise';
                } else if (p.includes('ai') || p.includes('startup') || p.includes('modern') || p.includes('saas') || p.includes('innovation')) {
                    finalTheme = 'bold';
                } else {
                    finalTheme = 'minimal';
                }
            }

            if (finalDensity === 'auto') {
                const p = prompt.toLowerCase();
                if (p.includes('dashboard') || p.includes('admin') || p.includes('analytics')) {
                    finalDensity = 'compact';
                } else {
                    finalDensity = 'comfortable';
                }
            }

            const promptText = getFullPageBlueprintPrompt(prompt, finalTheme, finalDensity);

            const text = await generateWithAI(promptText, modelProvider);

            let jsonStr = text;
            const codeBlockMatch = text.match(/\`\`\`(?!html|css|js)(?:\w+)?\n?([\s\S]*?)\`\`\`/);
            if (codeBlockMatch) {
                jsonStr = codeBlockMatch[1].trim();
            }

            const extractedJSON = jsonStr.match(/\{[\s\S]*\}/);
            if (!extractedJSON) throw new Error("Invalid format returned by AI");
            const blueprint = JSON.parse(extractedJSON[0]);
            setActiveBlueprint(blueprint);
            setOriginalBlueprint(JSON.parse(JSON.stringify(blueprint)));

            const pageCode = generatePageCode(blueprint);

            setGeneratedCode(pageCode);
            const reactFw = formOptions.find(o => o.value === 'react-tailwind');
            setFrameWork(reactFw);

            const preview = generatePreviewHtml(pageCode, 'react-tailwind');
            setPreviewHtml(preview);

            addToHistory(prompt + ' (Full Page)', pageCode, 'react-tailwind');

            setOutputScreen(true);
            setTab(2);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to generate blueprint or parse JSON");
        } finally {
            setLoading(false);
            if (window.innerWidth < 768) setMobileTab('preview');
        }
    };

    const getResponse = async () => {
        if (!prompt.trim()) return toast.error("Please describe your component first");

        try {
            setLoading(true);
            const promptText = getCreationPrompt(frameWork.value, prompt);

            const text = await generateWithAI(promptText, modelProvider);

            const extractedCode = extractCode(text);
            setGeneratedCode(extractedCode);

            const preview = generatePreviewHtml(extractedCode, frameWork.value);
            setPreviewHtml(preview);

            addToHistory(prompt, extractedCode, frameWork.value);

            setOutputScreen(true);
            setTab(2);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Something went wrong while generating code");
        } finally {
            setLoading(false);
            if (window.innerWidth < 768) setMobileTab('preview');
        }
    };

    const handleImprovement = async (actionPrompt) => {
        const codeToRefine = mode === 'create' ? generatedCode : inputCode;
        if (!codeToRefine.trim()) return toast.error("No code to refine");

        try {
            setLoading(true);
            if (mode === 'improve') setImprovedCode("");

            const userInstruction = actionPrompt === 'custom' ? customImprovePrompt : actionPrompt;
            const fullPrompt = getImprovementPrompt(userInstruction, codeToRefine);

            const text = await generateWithAI(fullPrompt, modelProvider);
            const extracted = extractCode(text);

            if (mode === 'create') {
                setGeneratedCode(extracted);
                addToHistory(prompt + " (Refined)", extracted, frameWork.value);
                toast.success("Code refined ✨");
                setCustomImprovePrompt("");
            } else {
                setImprovedCode(extracted);
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to improve code");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        setLoading,
        enhancing,
        enhancePrompt,
        getFullPageBlueprint,
        getResponse,
        handleImprovement
    };
};
