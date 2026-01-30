/**
 * Generates a previewable HTML string for a given code component and framework.
 * 
 * @param {string} code - The raw component code (HTML or JSX).
 * @param {string} framework - The selected framework ('react-tailwind' | 'html-css' | etc).
 * @returns {string} - The full HTML document string for the preview iframe.
 */
export const generatePreviewHtml = (code, framework) => {
    if (framework === 'react-tailwind') {
        // 1. Extract Component Name (simple regex for "export default function Name" or "const Name")
        // Fallback to 'Component' if parsing fails, but we usually want to try to find the main component.
        let componentName = 'Component';
        const match = code.match(/export\s+default\s+function\s+(\w+)/) ||
            code.match(/function\s+(\w+)/) ||
            code.match(/const\s+(\w+)\s*=/);

        if (match && match[1]) {
            componentName = match[1];
        }

        // 2. Clean up code for browser execution (Babel Standalone)
        // Remove imports as we use CDNs
        let browserCode = code
            .replace(/import\s+.*?from\s+['"].*?['"];?/g, '') // Remove imports
            .replace(/export\s+default\s+/g, ''); // Remove export default so we can just call it

        // If the cleanup removed the function name (e.g. "export default function() {...}"),
        // we might have an issue. But usually AI names it.
        // If "export default function App" -> "function App" (good)
        // If "export default App" (at bottom) -> "App" (good, line is useless but harmless)

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Basic reset to ensure full height */
    body, html { margin: 0; padding: 0; min-height: 100vh; background-color: #f5f5f5; }
    /* Dark mode simulation if needed, or rely on component styles */
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- React CDNs -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${browserCode}

    // Mount the component
    const root = ReactDOM.createRoot(document.getElementById('root'));
    try {
      root.render(React.createElement(${componentName}));
    } catch (e) {
      document.body.innerHTML = '<div style="color:red; padding:20px;"><h1>Preview Error</h1><pre>' + e.message + '</pre></div>';
    }
  </script>
</body>
</html>`;
    }

    // Default for HTML/CSS/Bootstrap/etc.
    // Assumes 'code' is already a full HTML document or content.
    // If it's just a snippet (no <html>), wrap it.
    if (!code.trim().toLowerCase().startsWith('<!doctype html') && !code.trim().toLowerCase().startsWith('<html')) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>body { min-height: 100vh; background-color: #f3f4f6; }</style>
</head>
<body>
    ${code}
</body>
</html>`;
    }

    return code;
};
