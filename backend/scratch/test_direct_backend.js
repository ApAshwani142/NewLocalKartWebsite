const endpoints = [
  { name: 'Customer Backend direct /api/products', url: 'https://newlocalkartwebsite-1.onrender.com/api/products' },
  { name: 'Customer Backend direct /api/stores', url: 'https://newlocalkartwebsite-1.onrender.com/api/stores' },
  { name: 'Shop Agent Backend direct /api/health', url: 'https://localkart-shop-agent.onrender.com/api/health' },
  { name: 'Shop Agent Backend direct /api/products', url: 'https://localkart-shop-agent.onrender.com/api/products' }
];

async function run() {
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      const text = await res.text();
      console.log(`[${res.status}] ${ep.name}:`, text.substring(0, 200));
    } catch (err) {
      console.error(`[ERR] ${ep.name}:`, err.message);
    }
  }
}

run();
