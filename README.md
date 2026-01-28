# ✨ ForgeUI - AI Component Generator

**ForgeUI** is a beautiful, minimalist, and powerful AI-driven tool that instantly converts your natural language prompts into production-ready UI components using state-of-the-art LLMs.

Powered by **Google's Gemini 2.5 Flash** and **Groq (Llama 3)**, ForgeUI bridges the gap between design and implementation, allowing you to prototype, build, and refine modern UI interfaces in seconds.

---

## 🚀 Features

### ✨ Create Mode
- **Instant Code Generation**: Just describe what you want (e.g., "A modern pricing card with glassmorphism"), and ForgeUI generates the full code instantly.
- **Multi-Model Support**: Choose between **Google Gemini** (for creative layouts) or **Groq Llama 3** (for lightning-fast speed).
- **Framework Flexibility**: Generate code for **React + Tailwind**, **HTML + CSS**, **Bootstrap**, and more.
- **AI Prompt Enhancer**: Stuck on a simple idea? Click "Enhance with AI" to let the system rewrite your prompt into a detailed, professional design spec.

### 🛠️ Improve Mode
- **AI Code Refinement**: Paste your existing (or generated) code and let AI improve it.
- **One-Click Actions**:
  - **Optimize Tailwind**: Deduplicate classes and fix conflicts.
  - **Accessibility**: Add ARIA labels and fix contrast issues.
  - **Dark Mode**: Automatically add Tailwind `dark:` classes.
  - **Animations**: Add smooth entry animations and micro-interactions.
  - **Refactor**: Clean up indentation and structure.
- **Diff View**: Compare the original and improved code side-by-side.

### 🌟 Core Experience
- **Minimalist Aesthetic**: A polished, dark-mode workspace designed with glassmorphism effects and clean typography.
- **Live Preview**: See your generated components come to life immediately in an interactive sandbox.
- **History Tracker**: Automatically saves your generations to local storage. Access them anytime from the history sidebar.
- **Export Options**: Copy code to clipboard or download as a standalone HTML file.
- **Fully Responsive**: All generated components are mobile-friendly and modern by default.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks (useState, useEffect)
- **AI Integration**:
  - [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)
  - [Groq SDK](https://www.npmjs.com/package/groq-sdk)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons (Io5)](https://react-icons.github.io/react-icons/)

---

## 📦 Installation & Setup

Follow these steps to run ForgeUI locally on your machine.

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
Create a `.env` file in the root directory and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```
> **Note:**
> - Get Gemini key from [Google AI Studio](https://aistudio.google.com/).
> - Get Groq key from [Groq Console](https://console.groq.com/).

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

---

## 🎮 How to Use

### Generating New Components
1. **Select Settings**: Choose your preferred AI model (Gemini/Groq) and Output Framework (e.g., React + Tailwind).
2. **Describe Your Vision**: Type a prompt like *"A login form with a gradient button"* into the text box.
3. **Enhance (Optional)**: Click **✨ Enhance with AI** to rewrite your prompt for better results.
4. **Generate**: Click the generate button and watch the magic happen.

### Improving Existing Code
1. Switch to **🛠️ Improve Existing** mode.
2. Paste your HTML/React code into the editor.
3. Select an improvement action (e.g., "Optimize Tailwind", "Add Dark Mode") or type a custom instruction.
4. View the changes in the **Diff View** or **Preview** tab.

---

## 📄 License

This project is open-source and free to use.

---

**Designed & Built with ❤️ by the ForgeUI Team.**
