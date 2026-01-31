
/**
 * Prompt Analysis & Enhancement Logic
 * Handles the logic for upgrading user prompts into professional design specifications.
 */

// --- 1. Analysis Layer ---

const COMPONENT_PATTERNS = {
    card: ['card', 'profile', 'product', 'item'],
    form: ['form', 'login', 'signup', 'register', 'contact', 'input'],
    navigation: ['navbar', 'nav', 'menu', 'sidebar', 'footer', 'breadcrumbs'],
    dashboard: ['dashboard', 'admin', 'panel', 'chart', 'analytics'],
    modal: ['modal', 'popup', 'dialog', 'overlay', 'alert'],
    gallery: ['gallery', 'grid', 'carousel', 'slider', 'showcase'],
    hero: ['hero', 'header', 'banner', 'landing'],
    pricing: ['pricing', 'plan', 'subscription', 'table']
};

const USE_CASES = {
    auth: ['login', 'signup', 'auth', 'password', 'register'],
    commerce: ['shop', 'store', 'product', 'cart', 'checkout'],
    marketing: ['landing', 'hero', 'feature', 'testimonial', 'pricing'],
    data: ['dashboard', 'chart', 'table', 'list', 'admin']
};

const inferContext = (text) => {
    const lower = text.toLowerCase();

    let type = 'component';
    for (const [key, keywords] of Object.entries(COMPONENT_PATTERNS)) {
        if (keywords.some(k => lower.includes(k))) {
            type = key;
            break;
        }
    }

    let useCase = 'general';
    for (const [key, keywords] of Object.entries(USE_CASES)) {
        if (keywords.some(k => lower.includes(k))) {
            useCase = key;
            break;
        }
    }

    return { type, useCase };
};

// --- 2. Constraint Injection ---

const getFrameworkConstraints = (framework) => {
    const map = {
        'html-css': "Use semantic HTML5 and vanilla CSS variables for theming. Ensure BEM naming convention.",
        'html-tailwind': "Use Tailwind CSS utility classes exclusively. Avoid custom CSS unless absolutely necessary. Use 'flex' and 'grid' for layouts.",
        'html-bootstrap': "Use Bootstrap 5 classes. Utilize the grid system (row, col-*) and standard components (card, btn, nav).",
        'html-css-js': "Write clean, modular JavaScript. formatting functions separately from DOM manipulation.",
        'react-tailwind': "Use React functional components with Tailwind CSS. Use semantic HTML tags. properly typed props if using TS usage context.",
        'html-tailwind-bootstrap': "Combine constraints intelligently if mixed, but prefer Tailwind for styling."
    };
    return map[framework] || map['html-tailwind'];
};

const getTypeConstraints = (type) => {
    const constraints = {
        card: "Ensure distinct hierarchy between title, subtitle, and body. Use shadow-sm or border for separation. Add hover elevation effects.",
        form: "Inputs must have clearly associated labels. Use visual cues for focus states (ring/border). Ensure adequate spacing between fields.",
        navigation: "Prioritize branding (logo) on the left/center. Ensure touch-target size is 44px+ for mobile links. Use semantic <nav>.",
        dashboard: "Use a dense but readable grid layout. Cards should have uniform height where possible. Emphasize data visibility.",
        modal: "Include a distinct backdrop (dimmed). Ensure 'close' button is prominent. Center content vertically and horizontally.",
        gallery: "Use CSS Grid with `auto-fill` for responsiveness. Maintain aspect ratios for images.",
        hero: "Use vh-based heights (e.g., min-h-[80vh]). Ensure text text-contrast against background images.",
        pricing: "Highlight the 'Preferred' or 'Pro' plan visually (scale, shadow, border-color). Use checkmarks for feature lists."
    };
    return constraints[type] || "Focus on visual hierarchy and spacing.";
};

// --- 3. Template System ---

const TEMPLATES = [
    // Template 1: Layout-First (Structural)
    {
        name: 'Layout-First',
        structure: `
    [Role]
    You are a UI Architect. Create a design specification for a [Type] focused on [UseCase].
    
    [Objective]
    Refine this request: "{originalPrompt}"
    
    [Output Structure]
    Design a UI with this exact layout structure:
    - Container: [Defined width/max-width]
    - Layout: [Grid/Flex strategy]
    - Sections: [Breakdown of internal areas]
    
    [Styling Rules]
    - Tone: {tone}
    - Colors: [Color palette advice]
    - Shadows: [Depth strategy]
    
    [Constraints]
    - {frameworkConstraint}
    - {typeConstraint}
    - Mobile: Stack vertically on screens < 768px.
    
    Return a concise, actionable prompt describing this component.
    `
    },
    // Template 2: UX-First (Interaction)
    {
        name: 'UX-First',
        structure: `
    [Role]
    You are a UX Specialist. Convert this request into a high-usability spec: "{originalPrompt}"
    
    [User Experience Goals]
    - Primary Action: Clear call-to-action placement.
    - Feedback: {animationConfig}
    - Accessibility: High contrast, discernible interactive elements.
    
    [Visuals]
    - Framework: {frameworkName}
    - Aesthetic: {tone}
    - Spacing: Comfortable (REM based).
    
    [Technical Specs]
    - {frameworkConstraint}
    - {typeConstraint}
    
    Output a prompt that emphasizes the user journey and interaction details of this UI.
    `
    },
    // Template 3: Style-First (Aesthetic)
    {
        name: 'Style-First',
        structure: `
    [Role]
    You are a Visual Designer. Create a stunning visual description for: "{originalPrompt}"
    
    [Visual Identity]
    - Style: {tone}
    - Accent: [Specific distinct color/gradient]
    - Typography: Clean sans-serif with varying weights.
    
    [Component Details]
    - Type: [Type] for [UseCase]
    - Decor: [Glassmorphism/Gradient borders/Subtle patterns]
    - {typeConstraint}
    
    [Implementation]
    - {frameworkConstraint}
    
    Write a request that focuses heavily on the visual impact and beauty (WOW factor) of the component.
    `
    }
];

// --- 4. Variability & Tone ---

const TONES = [
    "Modern & Minimalist (Clean, plenty of whitespace)",
    "Glassmorphism (Translucent layers, blurs, subtle borders)",
    "Neo-Brutalist (Bold borders, high contrast, geometric shadows)",
    "Soft UI / Neomorphism (Soft shadows, rounded, physical feel)",
    "Enterprise Clean (Corporate, blue/grey accents, dense information)",
    "Dark Mode Gradient (Deep, vibrant gradients, glowing effects)"
];

const ANIMATIONS = [
    "Subtle hover lifts and scale effects",
    "Smooth fade-in on entry",
    "Buttons with ripple or glow effects",
    "Interactive border transitions"
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- Main Export ---

export function buildEnhancementPrompt(userPrompt, frameworkValue) {
    // 1. Analyze
    const { type, useCase } = inferContext(userPrompt);

    // 2. Select Template & Variations
    const template = getRandom(TEMPLATES);
    const tone = getRandom(TONES);
    const animation = getRandom(ANIMATIONS);

    // 3. Inject Constraints
    const frameworkConstraint = getFrameworkConstraints(frameworkValue);
    const typeConstraint = getTypeConstraints(type);

    // 4. Fill Slots
    let metaPrompt = template.structure
        .replace('{originalPrompt}', userPrompt)
        .replace('[Type]', type)
        .replace('[UseCase]', useCase)
        .replace('{tone}', tone)
        .replace('{animationConfig}', animation)
        .replace('{frameworkConstraint}', frameworkConstraint)
        .replace('{typeConstraint}', typeConstraint)
        .replace('{frameworkName}', frameworkValue.replace('-', ' '));

    // 5. Final wrapper to ensure strictly the prompt is returned
    return `${metaPrompt}
  
  CRITICAL OUTPUT RULE:
  Return ONLY the rewritten prompt. Do not include labels like "Here is the prompt:" or markdown formatting unless it's part of the prompt itself. The output should be the raw text of the refined request ready to be fed into a code generator.`;
}
