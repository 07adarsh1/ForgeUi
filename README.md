# ✨ ForgeUI - AI Component Generator

**ForgeUI** is a beautiful, minimalist, and powerful AI-driven tool that instantly converts your natural language prompts into production-ready React + Tailwind CSS components.

Powered by **Google's Gemini 2.5 Flash model**, ForgeUI bridges the gap between design and implementation, allowing you to prototype and build modern UI interfaces in seconds.

---

## 🚀 Features

- **⚡ Instant Code Generation**: Just describe what you want (e.g., "A modern pricing card with glassmorphism"), and ForgeUI generates the full HTML/CSS/Tailwind code instantly.
- **🎨 Minimalist Aesthetic**: A polished, dark-mode workspace designed with glassmorphism effects and clean typography to keep you focused.
- **👁️ Live Preview**: See your generated components come to life immediately in an interactive sandbox.
- **🪄 AI Prompt Enhancer**: Stuck on a simple idea? Click "Enhance with AI" to let the system rewrite your prompt into a detailed, professional design spec.
- **🕰️ History Tracker**: Automatically saves your generations to local storage so you never lose your best ideas. Access them anytime from the history sidebar.
- **📝 Code Editor**: Built-in **Monaco Editor** allows you to view, edit, and copy the generated code directly.
- **📱 Fully Responsive**: All generated components are mobile-friendly and modern by default.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Model**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Icons**: [React Icons (Io5)](https://react-icons.github.io/react-icons/)
- **3D Effects**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Star Field Background)

---

## 📦 Installation & Setup

Follow these steps to run ForgeUI locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/forgeui.git
cd forgeui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```
> **Note:** You can get a free API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

---

## 🎮 How to Use

1. **Landing Page**: Click "Start Generating Free" to enter the app.
2. **Describe Your Vision**: Type a prompt like *"A login form with a gradient button"* into the text box.
3. **Enhance (Optional)**: Click the **✨ Enhance with AI** button to automatically add professional design details to your prompt.
4. **Generate**: Click the generate button.
5. **Preview & Edit**: Switch between the **Code** tab (to copy) and **Preview** tab (to interact).
6. **History**: Click the **Clock Icon** in the navbar to revisit past creations.

---

## 📄 License
This project is open-source and free to use.

---

**Designed & Built with ❤️.**
