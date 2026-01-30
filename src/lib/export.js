import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Generates a README.md file content based on the format.
 * @param {Object} component - The component object.
 * @returns {string} - The Markdown content.
 */
const generateReadme = (component) => {
    let meta = {};
    let preview = {};

    try {
        meta = component.files['meta.json'] ? JSON.parse(component.files['meta.json']) : {};
        preview = component.files['preview.json'] ? JSON.parse(component.files['preview.json']) : {};
    } catch (e) {
        console.warn("Failed to parse metadata", e);
    }

    const name = meta.name || component.folderName || 'Untitled Component';
    const createdDate = meta.createdAt ? new Date(meta.createdAt).toLocaleDateString() : 'Unknown date';
    const prompt = preview.originalPrompt || 'No prompt info available.';
    const format = meta.tags?.[0] || 'Unknown';

    let instructions = "";

    if (format.includes('React')) {
        instructions = `
## React + Tailwind Usage

1. **Install Dependencies**: Ensure you have React and Tailwind CSS installed.
2. **Copy Files**: Copy the \`components/${name}.tsx\` file into your project's components directory.
3. **Import**:
   \`\`\`tsx
   import ${name.replace(/\s+/g, '')} from './components/${name}';
   \`\`\`
4. **Tailwind Config**: Ensure your \`tailwind.config.js\` scans the new file for classes.
        `;
    } else if (format.includes('Bootstrap')) {
        instructions = `
## HTML + Bootstrap Usage

1. **Open File**: Open \`index.html\` in your browser.
2. **Dependencies**: This component requires **Bootstrap 5**. The CDN links are already included in the HTML head.
3. **Customization**: You can override Bootstrap classes with your own CSS if needed.
        `;
    } else if (component.files['script.js'] || format.includes('JS')) {
        instructions = `
## HTML + CSS + JS Usage

1. **Files**:
   - \`index.html\`: Structure
   - \`styles.css\`: Styling
   - \`script.js\`: Logic
2. **Setup**: Keep these 3 files in the same directory.
3. **Run**: Open \`index.html\` in any modern browser.
        `;
    } else if (format.includes('Tailwind')) {
        instructions = `
## HTML + Tailwind Usage

1. **Open File**: Open \`index.html\` in your browser.
2. **Dependencies**: This component uses **Tailwind CSS** via CDN.
3. **Integration**: Copy the HTML structure into your Tailwind-ready project.
        `;
    } else {
        instructions = `
## HTML + CSS Usage

1. **Open File**: Open \`index.html\` in your browser.
2. **Integration**: Copy the HTML structure and CSS styles into your own project files.
        `;
    }

    return `# ${name}

*Generated with ForgeUI on ${createdDate}*

## Original Prompt
> ${prompt}

${instructions}

## Structure
The ZIP file contains the raw source code for the component.
- **meta.json**: Generation metadata.

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
    const rootName = component.folderName || 'component';
    // Create a root folder inside the ZIP so extracting keeps files together
    const rootFolder = zip.folder(rootName);

    // Add all files from the virtual filesystem
    Object.entries(component.files).forEach(([filePath, content]) => {
        // If saving source code, ensure we aren't saving 'undefined' content
        if (content) {
            rootFolder.file(filePath, content);
        }
    });

    // Always regenerate README to ensure it's up to date with metadata
    rootFolder.file('README.md', generateReadme(component));

    // Generate ZIP blob
    const content = await zip.generateAsync({ type: 'blob' });

    // Trigger download
    saveAs(content, `${rootName}.zip`);
};
