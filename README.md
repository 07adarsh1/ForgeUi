# ✨ ForgeUI - AI Component Generator

**ForgeUI** is a beautiful, minimalist, and powerful AI-driven tool that instantly converts your natural language prompts into production-ready UI components using state-of-the-art LLMs.

Powered by **Google's Gemini 2.5 Flash** and **Groq (Llama 3)**, ForgeUI bridges the gap between design and implementation, allowing you to prototype, build, and refine modern UI interfaces in seconds.

---

## 🚀 Features

### ✨ Create Mode
- **Instant Code Generation**: Just describe what you want (e.g., "A modern pricing card with glassmorphism"), and ForgeUI generates the full code instantly.
- **Multi-Model Support**: Choose between **Google Gemini** (for creative layouts) or **Groq Llama 3** (for lightning-fast speed).
- **Framework Flexibility**: 
    - **React + Tailwind**: Generates `.tsx` components with `index.ts` exports.
    - **HTML + CSS + JS**: Automatically splits code into `index.html`, `styles.css`, and `script.js`.
    - **HTML + Bootstrap**: Includes CDN links automatically.
- **AI Prompt Enhancer**: Click "Enhance with AI" to transform simple ideas into professional design specs.

### 🛠️ Improve Mode
- **AI Code Refinement**: Paste existing code and let AI optimize it.
- **One-Click Actions**:
  - **Optimize Tailwind**: Deduplicate classes and fix conflicts.
  - **Accessibility**: Add ARIA labels and fix contrast issues.
  - **Dark Mode**: Automatically add Tailwind `dark:` classes.
  - **Animations**: Add smooth entry animations.
  - **Refactor**: Clean up indentation and structure.
- **Diff View**: Compare original vs. improved code side-by-side.

### 📚 Component Library
- **Virtual Filesystem**: Save components locally using IndexedDB.
- **Format-Aware Saving**:
    - **React**: Saves raw source code, ensuring no HTML leakage.
    - **HTML**: Preserves full structure.
- **Smart ZIP Export**: Download your components as structured ZIP files with auto-generated READMEs tailored to your framework.
- **Management**: Organize, view, edit, and delete components directly from the app.

### 🌟 Core Experience
- **Minimalist Aesthetic**: polished dark-mode workspace.
- **Live Preview**: Interactive sandbox for checking responsiveness.
- **History Tracker**: Auto-saves your session history.
- **Offline Capable**: Your library lives in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks + IndexedDB (idb)
- **AI Integration**:
  - [Google Generative AI](https://ai.google.dev/)
  - [Groq SDK](https://groq.com/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Icons**: [React Icons (Io5)](https://react-icons.github.io/react-icons/)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/07adarsh1/ForgeUi.git
cd ForgeUi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GROQ_API_KEY=your_groq_api_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 🎮 How to Use

### Generating Components
1. **Select Framework**: Choose `React + Tailwind`, `HTML + CSS`, etc.
2. **Describe**: Type a prompt (e.g., *"A login form with a gradient button"*).
3. **Generate**: Watch the AI build your UI in seconds.

### Saving & Exporting
- **Save to Library**: Click the Save icon to store it in your local library.
- **Export ZIP**: Download the component package.
    - React components include `.tsx` and `index.ts`.
    - HTML components include `index.html` (and `css/js` files if applicable).
    - A custom `README.md` is included in every ZIP.

### Managing Library
- Go to the **Library** tab.
- Browse your saved components in the file explorer.
- Edit code directly in the browser.
- **Delete** unwanted components using the trash icon.

---

## 📄 License

This project is open-source and free to use.

---

**Designed & Built with ❤️ by the ForgeUI Team.**
