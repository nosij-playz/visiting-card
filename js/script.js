/**
 * ARRAYCODE DIGITAL VISITING CARD
 * Only Split Style
 * - Laptop: Horizontal Card (No Scroll)
 * - Mobile: Vertical Card (No Scroll)
 * - Fetches from data/info.json
 */

const FALLBACK_CONFIG = {
  employee: {
    name: "Athul Raj",
    honorific: "",
    role: "Lead Product Engineer",
    department: "Engineering & Innovation",
    company: "Arraycode",
    pronouns: "He/Him",
    avatar: "data/img/dp.jpg",
    bio: "Senior Product Engineer at Arraycode. I build and ship high-performance web platforms, installable PWAs, and native-grade mobile experiences from scope to production.",
    email: "athul@arraycode.in",
    phone: "+91 98765 43210",
    phoneRaw: "+919876543210",
    whatsapp: "+919876543210",
    location: "Bengaluru, India",
    website: "https://www.arraycode.in",
    calendarUrl: "https://www.arraycode.in/contact",
    github: "https://github.com/arraycode",
    linkedin: "https://www.linkedin.com/company/arraycode.in/",
    twitter: "https://x.com/Arraycode_in",
    instagram: "https://www.instagram.com/arraycode.in"
  },
  company: {
    name: "Arraycode",
    tagline: "Product engineering, web, mobile and PWA",
    website: "https://www.arraycode.in",
    email: "hello@arraycode.in",
    logoMark: "data/img/arraycode-mark.png",
    logoWordmark: "data/img/arraycode-wordmark.png",
    logoWordmarkLight: "data/img/arraycode-wordmark-light.png"
  },
  badges: [
    { icon: "shield-check", text: "Verified Employee" },
    { icon: "terminal", text: "Full-Stack & PWA" },
    { icon: "zap", text: "Senior Engineering" }
  ],
  quickActions: [
    {
      id: "call",
      type: "tel",
      icon: "phone",
      title: "+91 98765 43210",
      subtitle: "Direct Call / SMS",
      url: "tel:+919876543210",
      copyValue: "+91 98765 43210"
    },
    {
      id: "email",
      type: "email",
      icon: "mail",
      title: "athul@arraycode.in",
      subtitle: "Work Email",
      url: "mailto:athul@arraycode.in",
      copyValue: "athul@arraycode.in"
    },
    {
      id: "whatsapp",
      type: "external",
      icon: "whatsapp",
      title: "Chat on WhatsApp",
      subtitle: "Instant message & updates",
      url: "https://wa.me/919876543210?text=Hello%20Athul,%20reaching%20out%20via%20your%20Arraycode%20visiting%20card."
    },
    {
      id: "booking",
      type: "external",
      icon: "calendar",
      title: "Book a Scope Call",
      subtitle: "Scope your project with us",
      url: "https://www.arraycode.in/contact"
    },
    {
      id: "website",
      type: "external",
      icon: "globe",
      title: "www.arraycode.in",
      subtitle: "Our Products & Platforms",
      url: "https://www.arraycode.in"
    },
    {
      id: "location",
      type: "external",
      icon: "map-pin",
      title: "Bengaluru, India",
      subtitle: "Arraycode Tech Hub",
      url: "https://maps.google.com/?q=Bengaluru,Karnataka,India"
    }
  ],
  socialLinks: [
    { platform: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/company/arraycode.in/" },
    { platform: "GitHub", icon: "github", url: "https://github.com/arraycode" },
    { platform: "Twitter / X", icon: "twitter", url: "https://x.com/Arraycode_in" },
    { platform: "Instagram", icon: "instagram", url: "https://www.instagram.com/arraycode.in" }
  ],
  services: [
    "Product Engineering",
    "Web Platforms",
    "Mobile Apps",
    "PWA Solutions",
    "Support & Scale"
  ]
};

let activeData = null;
let qrCodeInstance = null;

// Crisp SVG Icons
const ICONS = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  'map-pin': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
  github: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  gitlab: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 13.29-1.84-5.67a.84.84 0 0 0-1.6 0l-1.84 5.67H7.28L5.44 7.62a.84.84 0 0 0-1.6 0L2 13.29c-.19.58.02 1.22.51 1.58l9.49 6.88 9.49-6.88c.49-.36.7-1 1-.51.58z"></path></svg>`,
  'shield-check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>`,
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
  smartphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
  'user-check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`
};

document.addEventListener('DOMContentLoaded', () => {
  setupHandlers();
  fetchCardData();
});

function getActiveTenant() {
  const params = new URLSearchParams(window.location.search);
  const qTenant = params.get('u') || params.get('user') || params.get('name') || params.get('id');
  if (qTenant) return qTenant.toLowerCase().trim();

  // Handle hash route (e.g. #namit, #/jison) - 100% static compatible
  if (window.location.hash) {
    const hashClean = window.location.hash.replace(/^#\/?/, '').split('?')[0].toLowerCase().trim();
    if (hashClean && !hashClean.includes('.')) return hashClean;
  }

  const hostname = window.location.hostname.toLowerCase();
  const hostParts = hostname.split('.');
  if (hostParts.length > 1 && !['localhost', '127', 'www', 'arraycode', 'visiting-cards', 'visiting-card', 'onrender'].includes(hostParts[0])) {
    return hostParts[0];
  }

  const pathParts = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (pathParts[0] && !pathParts[0].includes('.') && pathParts[0] !== 'index.html') {
    return pathParts[0].toLowerCase().trim();
  }

  return '';
}

async function fetchCardData() {
  const tenant = getActiveTenant();
  
  // List of candidate paths to try (works seamlessly on static hosting, SPA rewrites, and Node backend)
  const candidateEndpoints = [];
  if (tenant) {
    // 1. Direct static employee JSON file
    candidateEndpoints.push(`data/employees/${encodeURIComponent(tenant)}.json`);
    candidateEndpoints.push(`/data/employees/${encodeURIComponent(tenant)}.json`);
    // 2. Dynamic Node.js server API
    candidateEndpoints.push(`/api/employee?u=${encodeURIComponent(tenant)}`);
  }
  // 3. Default base config
  candidateEndpoints.push('data/info.json');
  candidateEndpoints.push('/data/info.json');

  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetch(endpoint, { cache: 'no-cache' });
      if (res.ok) {
        const text = await res.text();
        // Ensure the response is valid JSON and not an HTML 404 fallback page
        if (text.trim().startsWith('{')) {
          const data = JSON.parse(text);
          if (data && data.employee) {
            activeData = data;
            renderVisitingCard(data);
            return;
          }
        }
      }
    } catch (e) {
      // Continue to next candidate endpoint
    }
  }

  console.warn('All candidate endpoints failed, falling back to static config');
  activeData = FALLBACK_CONFIG;
  renderVisitingCard(FALLBACK_CONFIG);
}

function renderVisitingCard(data) {
  const { employee, company, badges, quickActions, socialLinks, services } = data;

  // Dynamically update page title & Open Graph tags for this employee
  if (employee.name) {
    document.title = `${employee.name} — Arraycode`;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${employee.name} — ${employee.role || 'Arraycode'}`;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && employee.bio) ogDesc.content = employee.bio;
  }

  // 1. Employee Name, Title, Org
  const nameEl = document.getElementById('emp-name');
  if (nameEl) nameEl.textContent = employee.name;

  const roleEl = document.getElementById('emp-role');
  if (roleEl) roleEl.textContent = employee.role;

  const orgEl = document.getElementById('emp-org');
  if (orgEl) orgEl.textContent = `${employee.company || 'Arraycode'} · ${employee.department || 'Engineering'}`;

  // 2. Fully visible DP
  const dpEl = document.getElementById('emp-dp');
  if (dpEl) {
    dpEl.src = employee.avatar || 'data/img/dp.jpg';
    dpEl.alt = employee.name;
    dpEl.onerror = () => { dpEl.src = 'data/img/dp.jpg'; };
  }

  // 3. Brand Logos
  const markEl = document.getElementById('company-mark');
  if (markEl) markEl.src = company.logoMark || 'data/img/arraycode-mark.png';

  updateBrandWordmark();

  // 4. Meta Chips (Pronouns + Badges)
  const chipsContainer = document.getElementById('meta-chips-container');
  if (chipsContainer) {
    let chipsHTML = '';
    if (employee.pronouns) {
      chipsHTML += `<span class="meta-tag">${employee.pronouns}</span>`;
    }
    if (badges && badges.length) {
      badges.forEach(b => {
        const iconSvg = ICONS[b.icon] || ICONS['shield-check'];
        chipsHTML += `<span class="meta-tag">${iconSvg} ${b.text}</span>`;
      });
    }
    chipsContainer.innerHTML = chipsHTML;
  }

  // 5. Bio
  const bioEl = document.getElementById('emp-bio');
  if (bioEl) bioEl.textContent = employee.bio || '';

  // 6. Services Tags
  const servicesContainer = document.getElementById('services-chip-row');
  if (servicesContainer && services) {
    servicesContainer.innerHTML = services.map(s => `<span class="service-tag">${s}</span>`).join('');
  }

  // 7. Actions Grid (2-column on desktop, compact on mobile)
  renderActionsGrid(quickActions);

  // 8. Social Links
  renderSocialLinks(socialLinks);

  // 9. Pre-generate QR Code in modal
  generateCardQRCode();
}

function updateBrandWordmark() {
  const wordmarkEl = document.getElementById('company-wordmark');
  if (!wordmarkEl || !activeData || !activeData.company) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  wordmarkEl.src = isLight ?
    (activeData.company.logoWordmark || 'data/img/arraycode-wordmark.png') :
    (activeData.company.logoWordmarkLight || 'data/img/arraycode-wordmark-light.png');
}

function renderActionsGrid(actions) {
  const container = document.getElementById('action-cards-grid');
  if (!container || !actions) return;

  container.innerHTML = actions.map(act => {
    const iconSvg = ICONS[act.icon] || ICONS['globe'];
    const hasCopy = !!act.copyValue;

    return `
      <div class="action-grid-card" onclick="handleActionClick('${act.url}', '${act.type}')">
        <div class="action-card-left">
          <div class="action-icon-disc">
            ${iconSvg}
          </div>
          <div class="action-text-col">
            <span class="action-head-text">${act.title}</span>
            <span class="action-desc-text">${act.subtitle}</span>
          </div>
        </div>
        <div class="action-card-right">
          ${hasCopy ? `
            <button class="mini-copy-btn" title="Copy" onclick="copyToClipboard('${act.copyValue}', event)">
              ${ICONS['copy']}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderSocialLinks(socials) {
  const container = document.getElementById('social-inline-row');
  if (!container || !socials) return;

  container.innerHTML = socials.map(s => {
    const iconSvg = ICONS[s.icon] || ICONS['globe'];
    return `
      <a class="social-circle-link" href="${s.url}" target="_blank" rel="noopener noreferrer" title="${s.platform}">
        ${iconSvg}
      </a>
    `;
  }).join('');
}

function handleActionClick(url, type) {
  if (!url) return;
  if (type === 'tel' || type === 'email') {
    window.location.href = url;
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

function copyToClipboard(text, event) {
  if (event) event.stopPropagation();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied "${text}"`);
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showToast(`Copied "${text}"`);
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function downloadVCard() {
  if (!activeData || !activeData.employee) return;
  const { employee, company } = activeData;

  const names = employee.name.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${employee.name}`,
    `ORG:${employee.company || 'Arraycode'};${employee.department || 'Engineering'}`,
    `TITLE:${employee.role}`,
    `TEL;TYPE=WORK,VOICE:${employee.phoneRaw || employee.phone || ''}`,
    `EMAIL;TYPE=WORK,INTERNET:${employee.email || ''}`,
    `URL:${employee.website || 'https://www.arraycode.in'}`,
    `ADR;TYPE=WORK:;;${employee.location || 'Bengaluru'};;;India`,
    `NOTE:${company.tagline || 'Arraycode - Product engineering, web, mobile and PWA'}`,
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${employee.name.replace(/\s+/g, '_')}_Arraycode.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Saved contact card!`);
}

function generateCardQRCode() {
  const container = document.getElementById('qrcode-canvas');
  if (!container) return;
  container.innerHTML = '';
  const target = window.location.href;

  if (typeof QRCode !== 'undefined') {
    qrCodeInstance = new QRCode(container, {
      text: target,
      width: 170,
      height: 170,
      colorDark: '#070b16',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    container.innerHTML = `<p style="font-size: 11px; color: #64748b;">${target}</p>`;
  }
}

function updateThemeToggleIcon() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  themeBtn.innerHTML = isLight ?
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>` :
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  themeBtn.title = isLight ? "Switch to Dark Mode" : "Switch to Light Mode";
}

function setupHandlers() {
  // Theme Toggle (Default Light)
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    updateThemeToggleIcon();
    themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const nxt = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nxt);
      updateBrandWordmark();
      updateThemeToggleIcon();
    });
  }

  // Save Contact Buttons (both desktop & mobile triggers)
  const saveBtns = document.querySelectorAll('.save-vcard-btn');
  saveBtns.forEach(btn => btn.addEventListener('click', downloadVCard));

  // QR Modal
  const qrModal = document.getElementById('qr-modal');
  const qrTriggers = document.querySelectorAll('.qr-trigger-btn');
  const qrClose = document.getElementById('qr-modal-close');

  qrTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      generateCardQRCode();
      if (qrModal) qrModal.classList.add('active');
    });
  });

  if (qrClose && qrModal) {
    qrClose.addEventListener('click', () => qrModal.classList.remove('active'));
  }

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) qrModal.classList.remove('active');
    });
  }

  const modalCopyLink = document.getElementById('modal-copy-link');
  if (modalCopyLink) {
    modalCopyLink.addEventListener('click', () => {
      copyToClipboard(window.location.href);
    });
  }

  const modalSaveQr = document.getElementById('modal-download-qr');
  if (modalSaveQr) {
    modalSaveQr.addEventListener('click', () => {
      const canvas = document.querySelector('#qrcode-canvas canvas');
      const img = document.querySelector('#qrcode-canvas img');
      const src = canvas ? canvas.toDataURL('image/png') : (img ? img.src : null);
      if (src) {
        const a = document.createElement('a');
        a.href = src;
        a.download = `Arraycode_QR_${activeData.employee.name.replace(/\s+/g, '_')}.png`;
        a.click();
        showToast('QR code saved!');
      }
    });
  }
}


