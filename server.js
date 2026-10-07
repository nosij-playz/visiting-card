/**
 * ARRAYCODE MULTI-TENANT VISITING CARD SERVER
 * Pure Vanilla Node.js - Zero external npm dependencies.
 * 
 * Features:
 * 1. Subdomain Isolation (jison.arraycode.in, namit.arraycode.in)
 * 2. Path Isolation (localhost:3000/jison, localhost:3000/namit)
 * 3. Query Isolation (?u=jison, ?u=namit)
 * 4. In-Memory Map Routing with automatic JSON persistence
 * 5. Full static asset serving (HTML, CSS, JS, Images, Favicon)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const EMPLOYEES_DIR = path.join(ROOT_DIR, 'data', 'employees');

// In-Memory Data Store (Key: tenant id, Value: profile object)
const tenantStore = new Map();

// Supported MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.vcf': 'text/vcard; charset=utf-8'
};

// Ensure directory exists
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Load default template from data/info.json
function getBaseTemplate() {
  const baseFile = path.join(ROOT_DIR, 'data', 'info.json');
  if (fs.existsSync(baseFile)) {
    try {
      return JSON.parse(fs.readFileSync(baseFile, 'utf8'));
    } catch (e) {
      console.error('Error reading data/info.json:', e);
    }
  }
  return {
    employee: {
      name: "Athul Raj",
      role: "Lead Product Engineer",
      company: "Arraycode",
      department: "Engineering",
      avatar: "data/img/dp.jpg"
    },
    company: { name: "Arraycode", website: "https://www.arraycode.in" },
    badges: [],
    quickActions: [],
    socialLinks: [],
    services: []
  };
}

// Initialize team profiles into in-memory tenantStore
function initTenantStore() {
  ensureDirSync(EMPLOYEES_DIR);
  const base = getBaseTemplate();

  // Pre-configured team roster from Arraycode team
  const initialProfiles = {
    athul: {
      ...base,
      employee: {
        ...base.employee,
        name: "Athul Raj",
        role: "Lead Product Engineer",
        department: "Engineering & Innovation",
        email: "athul@arraycode.in",
        phone: "+91 98765 43210",
        bio: "Senior Product Engineer at Arraycode. I build and ship high-performance web platforms, installable PWAs, and native-grade mobile experiences from scope to production."
      }
    },
    jison: {
      ...base,
      employee: {
        ...base.employee,
        name: "Jison Joseph Sebastian",
        role: "AI/ML Engineer & Full Stack Developer",
        department: "AI Systems & Engineering",
        avatar: "data/img/jison.jpg",
        email: "jison@arraycode.in",
        phone: "+91 98765 43211",
        phoneRaw: "+919876543211",
        whatsapp: "+919876543211",
        location: "Kannur, Kerala, India",
        website: "https://www.jisonjosephsebastian.work.gd/",
        github: "https://github.com/nosij-playz",
        linkedin: "https://linkedin.com/in/nosij-playz44",
        bio: "AI/ML and full-stack developer working with machine learning, computer vision, agentic AI, and backend systems."
      }
    },
    nived: {
      ...base,
      employee: {
        ...base.employee,
        name: "Nived",
        role: "Technical Lead & Operations",
        department: "Engineering Operations",
        email: "nived@arraycode.in",
        phone: "+91 83040 67797",
        phoneRaw: "+918304067797",
        whatsapp: "+918304067797",
        bio: "Technical Lead at Arraycode driving product development, operations management, and engineering delivery."
      }
    },
    namit: {
      ...base,
      employee: {
        ...base.employee,
        name: "Namith K P",
        role: "Software Engineer",
        department: "Engineering & Innovation",
        email: "namith.works@gmail.com",
        phone: "+91 75102 87909",
        phoneRaw: "+917510287909",
        whatsapp: "+917510287909",
        website: "https://namit.info",
        github: "https://github.com/namitworks",
        gitlab: "https://gitlab.com/namitworks",
        linkedin: "https://linkedin.com/in/namithkp",
        location: "Kerala, India",
        bio: "Software Engineer focused on building and shipping production web and mobile products. I work across frontend, backend, APIs, cloud deployment and product engineering — from architecture and development to production support."
      }
    },
    vinay: {
      ...base,
      employee: {
        ...base.employee,
        name: "Vinay",
        role: "Software Engineer",
        department: "Core Engineering",
        email: "vinay@arraycode.in",
        phone: "+91 98765 43213",
        bio: "Software Engineer at Arraycode dedicated to robust engineering, algorithmic problem solving, clean code, and reliable platform services."
      }
    },
    irfan: {
      ...base,
      employee: {
        ...base.employee,
        name: "Irfan",
        role: "Product Developer",
        department: "Product Engineering",
        email: "irfan@arraycode.in",
        phone: "+91 98765 43214",
        bio: "Product Developer at Arraycode crafting modern responsive web applications, interactive UI components, and performant digital experiences."
      }
    },
    vishnu: {
      ...base,
      employee: {
        ...base.employee,
        name: "Vishnu C",
        role: "Customer Manager",
        department: "Customer Management & Relations",
        email: "vishnu03c@gmail.com",
        phone: "+91 95678 13815",
        phoneRaw: "+919567813815",
        whatsapp: "+919567813815",
        linkedin: "https://www.linkedin.com/in/vishnu-c-1aab09256",
        location: "Kozhikode, Kerala, India",
        bio: "Customer Manager at Arraycode leading client communications, partnership management, project discovery, and seamless customer success journeys."
      }
    },
    joseph: {
      ...base,
      employee: {
        ...base.employee,
        name: "Joseph J",
        role: "Technical Specialist",
        department: "Engineering Systems",
        email: "joseph@arraycode.in",
        phone: "+91 86067 64624",
        phoneRaw: "+918606764624",
        whatsapp: "+918606764624",
        bio: "Technical Specialist at Arraycode focusing on backend integrations, robust infrastructure, and quality engineering."
      }
    }
  };

  // Populate map and write files if they don't exist yet
  for (const [tenantId, profile] of Object.entries(initialProfiles)) {
    const filePath = path.join(EMPLOYEES_DIR, `${tenantId}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const diskData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        tenantStore.set(tenantId, diskData);
      } catch (err) {
        tenantStore.set(tenantId, profile);
      }
    } else {
      tenantStore.set(tenantId, profile);
      fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf8');
    }
  }

  // Also read any custom employee JSON files in data/employees
  const files = fs.readdirSync(EMPLOYEES_DIR);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const tenantId = path.basename(file, '.json').toLowerCase();
      if (!tenantStore.has(tenantId)) {
        try {
          const profile = JSON.parse(fs.readFileSync(path.join(EMPLOYEES_DIR, file), 'utf8'));
          tenantStore.set(tenantId, profile);
        } catch (e) {
          console.error(`Error loading ${file}:`, e);
        }
      }
    }
  }

  console.log(`Initialized tenant store with ${tenantStore.size} profiles: [${Array.from(tenantStore.keys()).join(', ')}]`);
}

// Extract tenant from Subdomain, Path, or Query
function extractTenant(req) {
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // 1. Query parameter (?u=jison or ?user=jison)
  const queryTenant = urlObj.searchParams.get('u') || urlObj.searchParams.get('user');
  if (queryTenant && tenantStore.has(queryTenant.toLowerCase())) {
    return queryTenant.toLowerCase();
  }

  // 2. Subdomain (e.g. jison.arraycode.in or jison.localhost)
  const hostParts = host.split('.');
  if (hostParts.length > 1) {
    const sub = hostParts[0].toLowerCase();
    if (!['www', 'localhost', '127', 'arraycode', 'visiting-cards', 'onrender'].includes(sub)) {
      if (tenantStore.has(sub)) return sub;
    }
  }

  // 3. Path route (e.g. /jison, /namit, /vinay)
  const pathname = urlObj.pathname.replace(/^\/+|\/+$/g, '');
  const firstSegment = pathname.split('/')[0]?.toLowerCase();
  if (firstSegment && tenantStore.has(firstSegment)) {
    return firstSegment;
  }

  // Default to athul (or first available tenant)
  return 'athul';
}

// Create the HTTP server
const server = http.createServer((req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const tenant = extractTenant(req);

  // CORS headers for API access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API ROUTE: Get list of all available employees
  if (req.method === 'GET' && pathname === '/api/employees') {
    const list = Array.from(tenantStore.keys()).map(id => {
      const data = tenantStore.get(id);
      return {
        id,
        name: data.employee?.name || id,
        role: data.employee?.role || '',
        avatar: data.employee?.avatar || 'data/img/dp.jpg'
      };
    });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(list, null, 2));
    return;
  }

  // API ROUTE: Get employee data (dynamic multi-tenant router)
  if (req.method === 'GET' && (pathname === '/api/employee' || pathname === '/data/info.json')) {
    const profile = tenantStore.get(tenant) || tenantStore.get('athul') || getBaseTemplate();
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Active-Tenant': tenant,
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify(profile, null, 2));
    return;
  }

  // API ROUTE: Update tenant data in memory and persist to disk
  if (req.method === 'POST' && (pathname === '/update' || pathname === '/api/employee')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const updatedData = JSON.parse(body);
        const targetTenant = (urlObj.searchParams.get('tenant') || tenant).toLowerCase();

        tenantStore.set(targetTenant, updatedData);

        // Persist to data/employees/<targetTenant>.json
        const targetPath = path.join(EMPLOYEES_DIR, `${targetTenant}.json`);
        fs.writeFileSync(targetPath, JSON.stringify(updatedData, null, 2), 'utf8');

        console.log(`[${targetTenant}] Updated visiting card profile successfully.`);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, tenant: targetTenant, message: 'Profile updated' }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // STATIC FILE ROUTING
  let filePath = path.join(ROOT_DIR, decodeURIComponent(pathname));

  // If path is a tenant alias (e.g. /jison or /namit), serve root index.html
  const pathClean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (tenantStore.has(pathClean) || pathname === '/' || pathname === '') {
    filePath = path.join(ROOT_DIR, 'index.html');
  }

  // Check if requested file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Default fallback to index.html for SPA-style routing
    const fallbackIndex = path.join(ROOT_DIR, 'index.html');
    if (fs.existsSync(fallbackIndex)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(fallbackIndex).pipe(res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  });
});

// Initialize in-memory store and start listening
initTenantStore();

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Arraycode Multi-Tenant Server is live on Port ${PORT}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
  console.log(`Test routes:`);
  console.log(`- http://localhost:${PORT}/athul`);
  console.log(`- http://localhost:${PORT}/jison`);
  console.log(`- http://localhost:${PORT}/namit`);
  console.log(`- http://localhost:${PORT}/vinay`);
  console.log(`- http://localhost:${PORT}/nived`);
  console.log(`- http://localhost:${PORT}/irfan`);
  console.log(`- http://localhost:${PORT}/vishnu`);
  console.log(`- http://localhost:${PORT}/joseph`);
});

