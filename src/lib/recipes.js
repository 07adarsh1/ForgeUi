import { themeVariants, layoutDensities } from './themeVariants.js';

export const componentRecipes = {
  Hero: (props) => {
    const visualStyle = props.visualStyle || 'minimal';
    const theme = themeVariants[visualStyle] || themeVariants.minimal;
    const density = layoutDensities[props.layoutDensity] || layoutDensities.comfortable;
    const bgClass = props.isAltContent ? theme.sectionAlt : theme.background;

    const layoutMap = {
      minimal: 'centered',
      bold: 'split',
      enterprise: 'compact-split'
    };

    // Fallback to minimal if visualStyle is unrecognized in map
    const layoutMode = layoutMap[visualStyle] || 'centered';

    const tagline = props.tagline ? '<span className="inline-flex items-center rounded-full border ' + theme.border + ' ' + theme.accentGlow + ' px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-8">' + props.tagline + '</span>' : '';
    const secondaryBtn = props.secondaryCTA || props.secondaryButton
      ? '<button className="px-8 py-4 transition-colors duration-200 ' + theme.secondaryBtn + '">' + (props.secondaryCTA || props.secondaryButton) + '</button>'
      : '';

    const primaryBtnText = props.primaryCTA || props.ctaText || "Get Started";

    if (layoutMode === 'split') {
      return `
export function Hero() {
  return (
    <section className="relative text-white flex items-center min-h-[85vh] ${density.sectionPadding} ${bgClass}">
      <div className="${density.containerWidth} mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 ${density.gridGap} items-center">
          <div className="flex flex-col items-start text-left shrink-0">
            ${tagline}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black capitalize tracking-tighter ${density.textSpacing} ${theme.headingWeight}">
              ${props.headline || "Unleash your potential."}
            </h1>
            <p className="text-xl ${density.textSpacing} max-w-lg leading-relaxed ${theme.textMuted}">
              ${props.subheadline || "The ultimate tool to accelerate your workflow and dominate your market."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto ${density.ctaSpacing}">
              <button className="px-10 py-5 transition-transform duration-200 hover:-translate-y-1 ${theme.primaryBtn}">
                ${primaryBtnText}
              </button>
              ${secondaryBtn}
            </div>
          </div>
          <div className="w-full aspect-square md:aspect-auto md:h-full rounded-2xl ${theme.cardBg} flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>
             <p className="text-white/40 font-bold uppercase tracking-widest group-hover:scale-110 transition-transform duration-500">Visual Content</p>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
    }

    if (layoutMode === 'compact-split') {
      return `
export function Hero() {
  return (
    <section className="relative text-white border-b ${theme.border} ${density.sectionPadding} ${bgClass}">
      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 flex flex-col items-start text-left">
          ${tagline}
          <h1 className="text-4xl sm:text-5xl tracking-tight leading-tight ${density.textSpacing} ${theme.headingWeight}">
             ${props.headline || "Enterprise-grade infrastructure."}
          </h1>
          <p className="text-base sm:text-lg ${density.textSpacing} max-w-md leading-relaxed ${theme.textMuted}">
             ${props.subheadline || "Secure, scalable, and built for modern teams that demand compliance and reliability."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto ${density.ctaSpacing}">
             <button className="px-6 py-3 transition-colors duration-200 w-full sm:w-auto ${theme.primaryBtn}">
               ${primaryBtnText}
             </button>
             ${secondaryBtn ? secondaryBtn.replace('px-8 py-4', 'px-6 py-3 w-full sm:w-auto text-center') : ''}
          </div>
        </div>
        <div className="hidden md:flex flex-1 w-full aspect-video rounded-lg ${theme.cardBg} items-center justify-center relative border shadow-sm">
           <i className="fa-solid fa-server text-3xl text-slate-700"></i>
        </div>
      </div>
    </section>
  );
}
`;
    }

    // Default 'centered' (minimal)
    return `
export function Hero() {
  return (
    <section className="relative text-white flex items-center justify-center min-h-[70vh] ${density.sectionPadding} ${bgClass}">
      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        ${tagline}
        <h1 className="text-5xl md:text-6xl lg:text-7xl lg:leading-[1.1] ${density.textSpacing} ${theme.headingWeight}">
          ${props.headline || "Build faster and better."}
        </h1>
        <p className="text-lg md:text-xl ${density.textSpacing} max-w-2xl leading-relaxed ${theme.textMuted}">
          ${props.subheadline || "The ultimate tool to accelerate your workflow and supercharge your productivity."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto ${density.ctaSpacing}">
          <button className="px-8 py-4 transition-colors duration-200 ${theme.primaryBtn}">
            ${primaryBtnText}
          </button>
          ${secondaryBtn}
        </div>
      </div>
    </section>
  );
}
`;
  },

  Features: (props) => {
    const visualStyle = props.visualStyle || 'minimal';
    const theme = themeVariants[visualStyle] || themeVariants.minimal;
    const density = layoutDensities[props.layoutDensity] || layoutDensities.comfortable;
    const bgClass = props.isAltContent ? theme.sectionAlt : theme.background;

    const layoutMap = {
      minimal: 'clean-grid',
      bold: 'card-grid',
      enterprise: 'bordered-grid'
    };
    const layoutMode = layoutMap[visualStyle] || 'clean-grid';

    const featuresList = props.features || [
      { title: "Feature 1", description: "Amazing feature description goes right here.", icon: "fa-bolt" },
      { title: "Feature 2", description: "Amazing feature description goes right here.", icon: "fa-shield-halved" },
      { title: "Feature 3", description: "Amazing feature description goes right here.", icon: "fa-chart-line" }
    ];

    let featureJSX = '';

    if (layoutMode === 'card-grid') {
      featureJSX = featuresList.map(f =>
        '<div className="transition-all duration-300 rounded-2xl border ' + theme.cardBg + ' ' + density.cardPadding + ' hover:-translate-y-2 relative group">' +
        '<div className="w-14 h-14 ' + theme.accentGlow + ' rounded-lg flex items-center justify-center mb-6 text-2xl border ' + theme.border + '">' +
        '<i className="fa-solid ' + (f.icon || 'fa-check') + '"></i>' +
        '</div>' +
        '<h3 className="text-2xl mb-3 ' + theme.headingWeight.replace(/text-(?:\dxl|sm|base|lg).*/g, '') + '">' + f.title + '</h3>' +
        '<p className="leading-relaxed ' + theme.textMuted + '">' + f.description + '</p>' +
        '</div>').join('');
    } else if (layoutMode === 'bordered-grid') {
      featureJSX = featuresList.map((f, i) =>
        '<div className="' + density.cardPadding + ' ' + (i < featuresList.length - 1 ? 'border-b md:border-b-0 md:border-r ' + theme.border : '') + '">' +
        '<div className="w-10 h-10 bg-slate-800 text-slate-300 rounded-md flex items-center justify-center mb-4 text-sm">' +
        '<i className="fa-solid ' + (f.icon || 'fa-check') + '"></i>' +
        '</div>' +
        '<h3 className="text-lg mb-2 font-semibold text-slate-100">' + f.title + '</h3>' +
        '<p className="text-sm leading-relaxed ' + theme.textMuted + '">' + f.description + '</p>' +
        '</div>').join('');
    } else {
      // default: clean-grid (minimal)
      featureJSX = featuresList.map(f =>
        '<div className="flex flex-col items-start">' +
        '<div className="w-10 h-10 ' + theme.accentGlow + ' rounded-full flex items-center justify-center mb-5 text-sm">' +
        '<i className="fa-solid ' + (f.icon || 'fa-check') + '"></i>' +
        '</div>' +
        '<h3 className="text-xl mb-2 ' + theme.headingWeight.replace(/text-(?:\dxl|sm|base|lg).*/g, '') + '">' + f.title + '</h3>' +
        '<p className="leading-relaxed ' + theme.textMuted + '">' + f.description + '</p>' +
        '</div>').join('');
    }

    const gridWrapperClasses = layoutMode === 'bordered-grid'
      ? 'grid grid-cols-1 md:grid-cols-3 border ' + theme.border + ' rounded-xl overflow-hidden bg-slate-900/50'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ' + density.gridGap;

    return `
export function Features() {
  return (
    <section className="text-white relative ${density.sectionPadding} ${bgClass}">
      <div className="mx-auto ${density.containerWidth} px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl ${density.textSpacing} ${theme.headingWeight}">${props.sectionTitle || "Powerful Features"}</h2>
          <p className="text-xl ${theme.textMuted}">Everything you need to manage your business and scale to the moon.</p>
        </div>
        <div className="${gridWrapperClasses}">
          ${featureJSX}
        </div>
      </div>
    </section>
  );
}
`;
  },

  Pricing: (props) => {
    const visualStyle = props.visualStyle || 'minimal';
    const theme = themeVariants[visualStyle] || themeVariants.minimal;
    const density = layoutDensities[props.layoutDensity] || layoutDensities.comfortable;
    const bgClass = props.isAltContent ? theme.sectionAlt : theme.background;

    const layoutMap = {
      minimal: '3-column',
      bold: 'highlighted-middle',
      enterprise: 'compact-grid'
    };
    const layoutMode = layoutMap[visualStyle] || '3-column';

    const plansInfo = props.plans || [
      { name: "Starter", price: "$19", buttonText: "Start Free Trial", features: ["1 User", "Basic Analytics", "24/7 Support"] },
      { name: "Pro", price: "$49", buttonText: "Upgrade to Pro", features: ["5 Users", "Advanced Analytics", "Priority Support"] }
    ];

    let gridWrapperClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto";
    if (layoutMode === 'compact-grid') gridWrapperClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 max-w-5xl mx-auto border " + theme.border + " rounded-xl overflow-hidden";
    if (plansInfo.length === 2 && layoutMode !== 'compact-grid') gridWrapperClasses = "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto";

    const plansJSX = plansInfo.map((p, i) => {
      const isHighlighted = layoutMode === 'highlighted-middle' && i === 1;
      const highlightClasses = isHighlighted ? ' ring-2 ring-indigo-500 scale-105 shadow-2xl z-10 bg-zinc-900 ' : ' border ' + theme.border + ' ' + theme.cardBg + ' ';

      let cardWrapper = '';
      if (layoutMode === 'compact-grid') {
        cardWrapper = '<div className="flex flex-col p-8 md:p-10 ' + theme.cardBg + ' ' + (i < plansInfo.length - 1 ? 'border-b md:border-b-0 md:border-r ' + theme.border : '') + '">' +
          '<h3 className="text-xl mb-1 font-semibold text-slate-100">' + p.name + '</h3>' +
          '<div className="mb-6"><span className="text-4xl font-bold tracking-tight">' + p.price + '</span><span className="' + theme.textMuted + '">/mo</span></div>' +
          '<ul className="space-y-4 mb-8 flex-1">' +
          p.features.map(f => '<li className="flex items-start text-sm text-slate-300"><i className="fa-solid fa-check mt-1 mr-3 text-emerald-400"></i>' + f + '</li>').join('') +
          '</ul>' +
          '<button className="w-full py-3 text-sm transition-colors duration-200 ' + theme.primaryBtn + '">' + p.buttonText + '</button>' +
          '</div>';
      } else {
        cardWrapper = '<div className="rounded-3xl flex flex-col transition-transform duration-300 p-8 md:p-10 relative ' + highlightClasses + '">' +
          (isHighlighted ? '<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">Most Popular</div>' : '') +
          '<h3 className="text-2xl mb-2 ' + theme.headingWeight.replace(/text-(?:\dxl|sm|base|lg).*/g, '') + '">' + p.name + '</h3>' +
          '<div className="my-6">' +
          '<span className="text-5xl ' + theme.headingWeight.replace(/text-(?:\dxl|sm|base|lg).*/g, '') + '">' + p.price + '</span>' +
          '<span className="' + theme.textMuted + '">/mo</span>' +
          '</div>' +
          '<ul className="space-y-4 mb-8 flex-1">' +
          p.features.map(f =>
            '<li className="flex items-center text-gray-300">' +
            '<div className="flex items-center justify-center w-5 h-5 rounded-full mr-3 ' + theme.accentGlow + '"><i className="fa-solid fa-check text-xs"></i></div>' +
            f +
            '</li>').join('') +
          '</ul>' +
          '<button className="w-full py-4 transition-colors duration-200 ' + (isHighlighted ? 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg' : theme.primaryBtn) + '">' +
          p.buttonText +
          '</button>' +
          '</div>';
      }
      return cardWrapper;
    }).join('');

    return `
export function Pricing() {
  return (
    <section className="text-white relative ${density.sectionPadding} ${bgClass}">
      <div className="mx-auto ${density.containerWidth} px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl ${density.textSpacing} ${theme.headingWeight}">${props.sectionTitle || "Simple, transparent pricing"}</h2>
          <p className="text-xl ${theme.textMuted}">No hidden fees. No surprise charges.</p>
        </div>
        <div className="${gridWrapperClasses}">
          ${plansJSX}
        </div>
      </div>
    </section>
  );
}
`;
  },

  Testimonials: (props) => {
    const theme = themeVariants[props.visualStyle] || themeVariants.minimal;
    const density = layoutDensities[props.layoutDensity] || layoutDensities.comfortable;
    const bgClass = props.isAltContent ? theme.sectionAlt : theme.background;

    const reviewsInfo = props.reviews || [
      { name: "Sarah Jenkins", role: "CEO at TechCorp", content: "This product changed our entire workflow. We save hundreds of hours each week!" },
      { name: "Mike Ross", role: "Product Manager", content: "Incredible attention to detail and a truly flawless user experience." }
    ];

    const reviewsJSX = reviewsInfo.map(r =>
      '<div className="border rounded-3xl ' + theme.cardBg + ' ' + density.cardPadding + '">' +
      '<div className="flex text-yellow-500 mb-4 text-sm gap-1">' +
      '<i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>' +
      '</div>' +
      '<p className="text-lg mb-6 leading-relaxed text-gray-200">"' + r.content + '"</p>' +
      '<div className="flex items-center gap-4">' +
      '<div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ' + theme.accentGlow + '">' +
      r.name.charAt(0) +
      '</div>' +
      '<div>' +
      '<h4 className="font-bold text-white">' + r.name + '</h4>' +
      '<p className="text-sm ' + theme.textMuted + '">' + r.role + '</p>' +
      '</div>' +
      '</div>' +
      '</div>').join('');

    return `
export function Testimonials() {
  return (
    <section className="text-white ${density.sectionPadding} ${bgClass}">
      <div className="mx-auto ${density.containerWidth} px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl ${density.textSpacing} ${theme.headingWeight}">${props.sectionTitle || "Trusted by thousands"}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 ${density.gridGap}">
          ${reviewsJSX}
        </div>
      </div>
    </section>
  );
}
`;
  },

  CTA: (props) => {
    const theme = themeVariants[props.visualStyle] || themeVariants.minimal;
    const density = layoutDensities[props.layoutDensity] || layoutDensities.comfortable;
    const bgClass = props.isAltContent ? theme.sectionAlt : theme.background;

    return `
export function CTA() {
  return (
    <section className="text-white py-20 relative overflow-hidden ${bgClass}">
      <div className="absolute inset-0 opacity-20 ${theme.accentGlow}"></div>
      <div className="relative mx-auto ${density.containerWidth} px-4 flex justify-center">
        <div className="border rounded-[3rem] ${theme.border} ${density.sectionPadding} px-8 sm:px-16 w-full max-w-4xl text-center ${theme.accentGlow}">
          <h2 className="text-3xl md:text-5xl ${density.textSpacing} ${theme.headingWeight}">${props.title || "Ready to dive in?"}</h2>
          <p className="text-lg md:text-xl ${density.textSpacing} max-w-2xl mx-auto ${theme.textMuted}">${props.description || "Join thousands of users who are already building faster."}</p>
          <div className="${density.ctaSpacing}">
            <button className="px-8 py-4 transition-colors duration-200 ${theme.primaryBtn}">
              ${props.buttonText || "Get Started for Free"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
  },

  Footer: (props) => {
    const theme = themeVariants[props.visualStyle] || themeVariants.minimal;

    const links = props.links || ['About', 'Blog', 'Jobs', 'Press'];
    const linksJSX = links.map(l => '<li><a href="#" className="hover:text-white transition-colors">' + l + '</a></li>').join('');

    return `
export function Footer() {
  return (
    <footer className="text-gray-400 py-12 border-t ${theme.border} ${theme.background}">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <i className="fa-solid fa-cube opacity-70"></i> ${props.companyName || "ForgeUI"}
        </div>
        <ul className="flex flex-wrap justify-center gap-6 text-sm">
          ${linksJSX}
        </ul>
        <div className="flex gap-4 text-xl">
          <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-twitter"></i></a>
          <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-github"></i></a>
          <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-discord"></i></a>
        </div>
      </div>
      <div className="mt-8 text-center text-sm ${theme.textMuted}">
        &copy; ${new Date().getFullYear()} ${props.companyName || "ForgeUI"}. All rights reserved.
      </div>
    </footer>
  );
}
`
  }
};

export const generatePageCode = (blueprintParams) => {
  const sections = blueprintParams.sections || [];

  let imports = "import React from 'react';\n\n";

  const controlBarComponents = `
const IconButton = ({ icon, onClick, disabled }) => {
  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={\`text-white/60 hover:text-white hover:bg-white/10 rounded-md p-1 transition-colors \${disabled ? 'opacity-30 cursor-not-allowed' : 'active:scale-95'}\`}
    >
      <i className={\`fa-solid \${icon} text-[14px] w-4 h-4 flex items-center justify-center\`}></i>
    </button>
  );
};

const SectionControlBar = ({ label, index, onRegenerate, onEdit, onDelete }) => {
  return (
    <div className="absolute top-4 right-4 z-[60] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 backdrop-blur-md shadow-lg">
        <span className="text-xs text-white/60 mr-2 font-medium tracking-wide uppercase">{label}</span>
        <div className="flex items-center gap-1 border-l border-white/10 pl-2">
          <IconButton icon="fa-arrows-rotate" onClick={() => onRegenerate(index)} />
          <IconButton icon="fa-pen" onClick={() => onEdit(index)} />
          <IconButton icon="fa-trash" onClick={() => onDelete(index)} />
        </div>
      </div>
    </div>
  );
};

const AddSectionTrigger = ({ index, onAdd }) => {
  return (
    <div className="relative group/trigger -my-3 z-50 flex items-center justify-center h-6">
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/trigger:opacity-100 transition-opacity duration-200">
        <div className="w-full border-t border-dashed border-white/20"></div>
        <button 
          onClick={() => onAdd(index)}
          className="absolute shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs font-medium text-white/70 hover:text-white hover:bg-neutral-800 transition-colors shadow-xl"
        >
          <i className="fa-solid fa-plus pt-[1px]"></i> Add Section
        </button>
      </div>
    </div>
  );
};
`;

  let sectionComponents = controlBarComponents + "\n";
  let usedSectionsList = [];
  let usedSectionsTypes = [];

  const visualStyle = blueprintParams.visualStyle || 'minimal';
  const layoutDensity = blueprintParams.layoutDensity || 'comfortable';

  sections.forEach((sec, index) => {
    let type = sec.type;

    if (!componentRecipes[type]) return;

    // Rhythm logic: Alternate background for even indexed sections (except hero and footer generally, but simple odd/even here)
    const isAltContent = (index % 2 !== 0 && type !== 'CTA' && type !== 'Footer');

    let combinedProps = {
      ...sec.props,
      visualStyle,
      layoutDensity,
      isAltContent
    };

    let componentString = componentRecipes[type](combinedProps);
    const uniqueName = type + "Section" + index;

    componentString = componentString.replace(new RegExp("export function " + type), "const " + uniqueName + " = function");

    sectionComponents += componentString + "\n\n";
    usedSectionsList.push(uniqueName);
    usedSectionsTypes.push(type);
  });

  const bodyJSX = usedSectionsList.map((name, index) => {
    return `
      ${index === 0 ? `<AddSectionTrigger index={0} onAdd={(idx) => window.parent.postMessage({ type: 'OPEN_ADD_MODAL', index: idx }, '*')} />` : ''}
      <div className="relative group">
        <SectionControlBar 
          label="${usedSectionsTypes[index]}" 
          index={${index}} 
          onRegenerate={(idx) => window.parent.postMessage({ type: 'REGENERATE_SECTION', index: idx }, '*')}
          onEdit={(idx) => window.parent.postMessage({ type: 'EDIT_SECTION', index: idx }, '*')}
          onDelete={(idx) => window.parent.postMessage({ type: 'DELETE_SECTION', index: idx }, '*')}
        />
        <${name} />
      </div>
      <AddSectionTrigger index={${index + 1}} onAdd={(idx) => window.parent.postMessage({ type: 'OPEN_ADD_MODAL', index: idx }, '*')} />
      `;
  }).join("\n");

  let mainPage = 'export default function FullPage() {\n' +
    '  return (\n' +
    '    <main className="min-h-screen bg-black font-sans text-white">\n' +
    '      ' + bodyJSX + '\n' +
    '    </main>\n' +
    '  );\n' +
    '}\n';

  return imports + sectionComponents + mainPage;
};
