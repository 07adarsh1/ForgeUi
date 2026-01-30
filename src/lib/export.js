import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Generates a README.md file content for the exported component.
 * @param {Object} component - The component object from the library.
 * @returns {string} - The Markdown content.
 */
const generateReadme = (component) => {
    let meta = {};
    let preview = {};

    try {
        meta = component.files['meta.json'] ? JSON.parse(component.files['meta.json']) : {};
        preview = component.files['preview.json'] ? JSON.parse(component.files['preview.json']) : {};
    } catch (e) {
        console.warn("Failed to parse metadata for README generation", e);
    }

    const name = meta.name || component.folderName || 'Untitled Component';
    const createdDate = meta.createdAt ? new Date(meta.createdAt).toLocaleDateString() : 'Unknown date';
    const prompt = preview.originalPrompt || 'No prompt info available.';

    return `# ${name}

Generated with ForgeUI on ${createdDate}.

## Original Prompt
> ${prompt}

## Usage

This component was generated as a standalone generic HTML/CSS/JS or React component. 

### Structure
- **components/**: Contains the main source code.
- **index.ts**: Entry point export.
- **meta.json**: Metadata about the generation.

### How to use
1. Copy the files into your project.
2. If using React, ensure you have Tailwind CSS configured or include the CDN.
3. Import the component as needed.

---
*Powered by ForgeUI*
`;
};

/**
 * Exports a component as a ZIP file.
 * @param {Object} component - The component object from the library.
 */
export const exportComponentAsZip = async (component) => {
    if (!component) {
        throw new Error("No component to export.");
    }

    const zip = new JSZip();
    const rootFolder = zip.folder(component.folderName || 'component');

    // Add all files from the virtual filesystem
    Object.entries(component.files).forEach(([filePath, content]) => {
        rootFolder.file(filePath, content);
    });

    // Add README.md if it doesn't strictly exist in the files map (it shouldn't usually, but good to ensure)
    if (!component.files['README.md']) {
        rootFolder.file('README.md', generateReadme(component));
    }

    // Generate ZIP blob
    const content = await zip.generateAsync({ type: 'blob' });

    // Trigger download
    saveAs(content, `${component.folderName || 'forge-component'}.zip`);
};
