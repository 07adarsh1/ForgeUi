/**
 * Extracts code from a markdown code block if present, otherwise returns the raw text.
 */
export const extractCode = (response) => {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
};

/**
 * Prepares the file structure for saving to the Virtual Library based on the framework and generated code.
 * Handles splitting logic for HTML/CSS/JS and React formatting.
 * 
 * @param {string} code - The raw generated code.
 * @param {string} framework - The selected framework value.
 * @param {string} folderName - The unique folder identifier.
 * @param {string} prompt - The original prompt used.
 * @param {string} timestamp - Creation timestamp.
 * @param {string} customName - (Optional) User defined component name.
 * @param {string} customTags - (Optional) User defined comma separated tags.
 * @returns {Object} - The full component object structure ready for saving.
 */
export const prepareComponentForSave = (code, framework, folderName, prompt, timestamp, customName = null, customTags = "", mode = "create") => {
    const nameGuess = customName || (prompt || "Untitled Component").split(' ').slice(0, 3).join(' ');
    const componentName = folderName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    const isReact = framework === 'react-tailwind';

    // Process Tags
    const frameworkTag = getTagLabel(framework);
    const typeTag = isReact ? 'React' : 'HTML';
    const userTags = customTags ? customTags.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Ensure unique tags
    const finalTags = [...new Set([frameworkTag, typeTag, ...userTags])];

    // Base object
    const component = {
        folderName,
        files: {
            "meta.json": JSON.stringify({
                name: nameGuess,
                tags: finalTags,
                format: framework,
                createdAt: timestamp
            }, null, 2),
            "preview.json": JSON.stringify({
                originalPrompt: prompt,
                thumbnail: ""
            }, null, 2)
        }
    };

    if (isReact && mode === 'fullpage') {
        component.files["page.tsx"] = code;

        const sectionsMatch = code.match(/const (\w+) = function\(\) \{[\s\S]*?(?=\nconst \w+ = function|\nexport default function)/g);
        if (sectionsMatch) {
            sectionsMatch.forEach(sec => {
                const nameMatch = sec.match(/const (\w+) =/);
                if (nameMatch) {
                    const compName = nameMatch[1];
                    // Convert back to regular export function
                    const cleanSec = sec.replace(`const ${compName} = function`, `export default function ${compName}`);
                    component.files[`components/${compName}.tsx`] = `import React from 'react';\n\n${cleanSec}`;
                }
            });
        }
    } else if (isReact) {
        // React + Tailwind
        const fileName = `components/${componentName}.tsx`;
        component.files[fileName] = code;
        component.files["index.ts"] = `export { default } from './components/${componentName}';`;
    } else if (framework === 'html-css-js') {
        // Split HTML, CSS, JS
        const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const jsMatch = code.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/i);

        let htmlContent = code;
        let cssContent = "";
        let jsContent = "";

        if (cssMatch) {
            cssContent = cssMatch[1].trim();
            // Replace style tag with link
            htmlContent = htmlContent.replace(cssMatch[0], '<link rel="stylesheet" href="./styles.css">');
        }
        if (jsMatch) {
            jsContent = jsMatch[1].trim();
            // Replace script tag with external source
            htmlContent = htmlContent.replace(jsMatch[0], '<script src="./script.js"></script>');
        }

        component.files["index.html"] = htmlContent;
        if (cssContent) component.files["styles.css"] = cssContent;
        if (jsContent) component.files["script.js"] = jsContent;

    } else {
        // Standard HTML (Bootstrap, Tailwind, etc.)
        component.files["index.html"] = code;
    }

    return component;
};

// Helper to get readable tag from framework value
const getTagLabel = (val) => {
    const map = {
        'html-css': 'HTML + CSS',
        'html-tailwind': 'HTML + Tailwind',
        'html-bootstrap': 'Bootstrap',
        'html-css-js': 'HTML + JS',
        'react-tailwind': 'React'
    };
    return map[val] || 'Unknown';
};
