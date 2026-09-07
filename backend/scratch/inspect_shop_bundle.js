async function inspectShopAgentBundle() {
  const url = 'https://local-kart-shop-agent-4vgq-six.vercel.app/_next/static/immutable/chunks/03cnaoo_1ldej.js';
  const res = await fetch(url);
  const text = await res.text();
  console.log('Bundle length:', text.length);

  // Search for http, api, render, localhost
  const matches = text.match(/(https?:\/\/[^\s"']+|localhost:[0-9]+|\/api\/[a-zA-Z0-9_\-\/]+)/g) || [];
  console.log('Matches in Shop Agent bundle:', [...new Set(matches)]);
}

inspectShopAgentBundle();
