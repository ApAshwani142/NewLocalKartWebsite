export default function robots() {
  const baseUrl = 'https://www.e-localkart.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/login',
          '/signup',
          '/checkout',
          '/account',
          '/addresses',
          '/orders',
          '/notifications',
          '/settings',
          '/wishlist',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
