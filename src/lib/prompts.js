export const getCreationPrompt = (framework, userPrompt) => {
  if (framework === 'react-tailwind') {
    return `
      You are an expert React developer.
      
      **Task:** Generate a single React functional component for: "${userPrompt}"
      
      **Requirements:**
      1. **Framework:** React + Tailwind CSS.
      2. **Format:** Return ONLY the raw JSX/TSX content. 
         - DO NOT wrap in \`<html>\`. 
         - DO NOT add \`ReactDOM.render\`.
         - DO NOT include import statements (assume React is global or already imported).
         - Export the component as default (e.g. \`export default function Component() ...\`).
      3. **Design:** Modern, minimalist, glassmorphism/neomorphism where appropriate.
      4. **Icons:** Use FontAwesome classes (e.g. \`<i className="fa-solid fa-home"></i>\`).
      5. **Output:** Return ONLY the code inside a markdown block.
    `;
  }

  if (framework === 'html-css-js') {
    return `
      You are an expert frontend developer.
      
      **Task:** Generate a complete component for: "${userPrompt}" using HTML, CSS, and JavaScript.
      
      **Requirements:**
      1. **Structure:** Return a SINGLE HTML file containing:
         - \`<!DOCTYPE html>\` structure.
         - CSS inside \`<style>\` tags in the head.
         - JavaScript inside \`<script>\` tags at the end of the body.
      2. **Design:** Modern, minimalist, clean UI.
      3. **Icons:** Use FontAwesome.
      4. **Output:** Return ONLY the raw HTML code inside a markdown code block.
    `;
  }

  if (framework === 'html-bootstrap') {
    return `
      You are an expert frontend developer.
      
      **Task:** Generate a single HTML file for: "${userPrompt}" using the Bootstrap Framework.
      
      **Requirements:**
      1. **Framework:** Bootstrap 5.
      2. **Dependencies:**
         - Include Bootstrap CSS/JS via CDN.
         - Include FontAwesome.
      3. **Design:** Modern, minimalist, utilizing Bootstrap classes effectively.
      4. **Output:** Return ONLY the raw HTML code inside a markdown code block.
    `;
  }

  // Default: HTML + Tailwind or Plain CSS
  return `
      You are an expert frontend developer.
      
      **Task:** Generate a single HTML file for: "${userPrompt}"
      
      **Requirements:**
      1. **Framework:** ${framework === 'html-css' ? 'Vanilla CSS (No frameworks)' : 'Tailwind CSS'}.
      2. **Structure:** Return a COMPLETE HTML file (<!DOCTYPE html>...</html>).
      3. **Dependencies:**
         ${framework === 'html-tailwind' ? '- Include Tailwind CSS CDN (<script src="https://cdn.tailwindcss.com"></script>).' : ''}
         - Include FontAwesome (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">).
         - Include Google Fonts.
      4. **Design:** Modern, minimalist.
      5. **Responsiveness:** Fully mobile-responsive.
      6. **Output:** Return ONLY the raw code inside a markdown code block.
  `;
};



export const getImprovementPrompt = (task, code) => {
  return `
    You are an expert code refactorer.
    
    **Task:** ${task}
    
    **Input Code:**
    \`\`\`
    ${code}
    \`\`\`
    
    **Output:** Return ONLY the full improved code inside a markdown code block. Do not add explanations.
  `;
};
