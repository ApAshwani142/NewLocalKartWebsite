async function inspectFrontend(url) {
  console.log(`\n=== INSPECTING ${url} ===`);
  const res = await fetch(url);
  const html = await res.text();
  console.log('HTML length:', html.length);

  // Check for env vars or backend URLs in HTML
  const renderMatches = html.match(/https?:\/\/[^\s"'>]+onrender\.com[^\s"'>]*/g) || [];
  console.log('Render URLs in HTML:', renderMatches);

  const scriptMatches = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);
  console.log(`Found ${scriptMatches.length} script tags:`, scriptMatches.slice(0, 5));

  // Check the first 5 script bundles for backend references
  for (const scriptSrc of scriptMatches.slice(0, 8)) {
    const fullScriptUrl = scriptSrc.startsWith('http') ? scriptSrc : `${url.replace(/\/$/, '')}${scriptSrc}`;
    try {
      const sRes = await fetch(fullScriptUrl);
      const sText = await sRes.text();
      const inScript = sText.match(/https?:\/\/[^\s"'>]+onrender\.com[^\s"'>]*/g) || [];
      const apiMatches = sText.match(/\/api\/[a-zA-Z0-9_\-\/]+/g) || [];
      const nextPublicMatches = sText.match(/NEXT_PUBLIC_[A-Z0-9_]+/g) || [];
      if (inScript.length > 0 || nextPublicMatches.length > 0) {
        console.log(`\nScript: ${scriptSrc}`);
        console.log('  onrender matches:', [...new Set(inScript)]);
        console.log('  NEXT_PUBLIC matches:', [...new Set(nextPublicMatches)]);
      }
    } catch (e) {
      console.log(`  Failed to fetch ${scriptSrc}: ${e.message}`);
    }
  }
}

async function run() {
  await inspectFrontend('https://new-local-kart-website.vercel.app/');
  await inspectFrontend('https://local-kart-shop-agent-4vgq-six.vercel.app/');
}

run();
