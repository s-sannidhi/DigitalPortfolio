const themes = {
    mocha:      { hex: '#c4a574', rgb: '196, 165, 116' },
    vesper:     { hex: '#ffb86c', rgb: '255, 184, 108' },
    nord:       { hex: '#547ABF', rgb: '84, 122, 191' },
    evergreen:  { hex: '#A9C76B', rgb: '169, 199, 107' },
    catppuccin: { hex: '#D7A9E3', rgb: '215, 169, 227' }
};

function ensureThemeOverrideStyles() {
    if (document.getElementById('theme-overrides')) return;
    const style = document.createElement('style');
    style.id = 'theme-overrides';
    style.textContent = `
      .border-accent\\/20 { border-color: rgba(var(--accent-rgb), 0.22) !important; }
      [class~="border-accent/20"], [class*="border-accent/20"] { border-color: rgba(var(--accent-rgb), 0.22) !important; }
      .interactive-card { border-color: rgba(var(--accent-rgb), 0.22) !important; }
      footer { border-color: rgba(var(--accent-rgb), 0.22) !important; }
      .border-t { border-top-color: rgba(var(--accent-rgb), 0.22) !important; }
    `;
    document.head.appendChild(style);
}

function normalizeBorders() {
    document.querySelectorAll('[class*="border-accent/20"]').forEach((el) => {
        const hasTop = el.classList.contains('border-t');
        el.className = el.className.replace(/border-accent\/20/g, '').replace(/\s+/g, ' ').trim();
        el.classList.add(hasTop ? 'accent-runtime-top' : 'accent-runtime');
    });
    document.querySelectorAll('.interactive-card').forEach((el) => el.classList.add('accent-runtime'));
}

function applyTheme(key) {
    const theme = themes[key] || themes.mocha;
    document.documentElement.setAttribute('data-theme', key);
    document.documentElement.style.setProperty('--accent', theme.hex);
    document.documentElement.style.setProperty('--accent-rgb', theme.rgb);
    ensureThemeOverrideStyles();
    normalizeBorders();

    try {
        document.querySelectorAll('.accent-runtime, .interactive-card, footer, .accent-runtime-top').forEach((el) => {
            if (el.classList.contains('accent-runtime-top')) {
                el.style.borderTopColor = `rgba(${theme.rgb}, 0.22)`;
            } else {
                el.style.borderColor = `rgba(${theme.rgb}, 0.22)`;
            }
        });
    } catch (_) {}

    try {
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.particles.color.value = theme.hex;
            window.pJSDom[0].pJS.particles.line_linked.color = theme.hex;
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    } catch (_) {}

    try {
        const surfaceFill = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim() || '#0a0a0a';
        const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="8" fill="${surfaceFill}"/><text x="50" y="68" font-family="Consolas, 'Courier New', monospace" font-weight="900" font-size="70" fill="${theme.hex}" text-anchor="middle">/S</text></svg>`;
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        let link = document.getElementById('site-favicon');
        if (!link) {
            link = document.createElement('link');
            link.id = 'site-favicon';
            link.rel = 'icon';
            link.type = 'image/svg+xml';
            document.head.appendChild(link);
        }
        if (link.dataset.objectUrl) {
            try { URL.revokeObjectURL(link.dataset.objectUrl); } catch (_) {}
        }
        link.href = url;
        link.dataset.objectUrl = url;
    } catch (_) {}
}

// Load saved theme on startup
const savedTheme = localStorage.getItem('theme-accent');
if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme);
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
    [document.getElementById('theme-' + savedTheme), document.getElementById('m-theme-' + savedTheme)]
        .forEach(el => el && el.classList.add('selected'));
} else {
    applyTheme('mocha');
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
    ['theme-mocha', 'm-theme-mocha'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('selected');
    });
}

// Bind swatch click handlers
[
    ['theme-mocha', 'mocha'], ['theme-vesper', 'vesper'], ['theme-nord', 'nord'],
    ['theme-evergreen', 'evergreen'], ['theme-catppuccin', 'catppuccin'],
    ['m-theme-mocha', 'mocha'], ['m-theme-vesper', 'vesper'], ['m-theme-nord', 'nord'],
    ['m-theme-evergreen', 'evergreen'], ['m-theme-catppuccin', 'catppuccin']
].forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', () => {
            applyTheme(key);
            localStorage.setItem('theme-accent', key);
            document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');
        });
    }
});
