import https from 'https';

const targets = [
  { name: 'Customer Frontend (Vercel)', url: 'https://new-local-kart-website.vercel.app/' },
  { name: 'Shop Agent Frontend (Vercel)', url: 'https://local-kart-shop-agent-4vgq-six.vercel.app/' },
  { name: 'Customer Backend (Render direct)', url: 'https://newlocalkartwebsite-1.onrender.com/api' },
  { name: 'Shop Agent Backend (Render direct)', url: 'https://localkart-shop-agent.onrender.com/api' },
  { name: 'Customer Frontend Proxy /api/products', url: 'https://new-local-kart-website.vercel.app/api/products' },
  { name: 'Shop Agent Frontend Proxy /api/products', url: 'https://local-kart-shop-agent-4vgq-six.vercel.app/api/products' }
];

async function checkUrl(name, url) {
  const start = Date.now();
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'eLocalKart-QA-Tester/1.0' },
      signal: AbortSignal.timeout(90000) // 90s for cold start
    });
    const duration = Date.now() - start;
    const bodyText = await res.text();
    let preview = bodyText.substring(0, 150).replace(/\n/g, ' ');
    console.log(`[${res.status}] ${name} (${duration}ms): ${preview}`);
    return { name, url, status: res.status, duration, ok: true, preview };
  } catch (err) {
    const duration = Date.now() - start;
    console.error(`[FAIL] ${name} (${duration}ms): ${err.message}`);
    return { name, url, status: 0, duration, ok: false, error: err.message };
  }
}

async function run() {
  console.log('--- WAKING UP & TESTING REACHABILITY (Allowing up to 90s for Render cold start) ---');
  for (const t of targets) {
    await checkUrl(t.name, t.url);
  }
}

run();
