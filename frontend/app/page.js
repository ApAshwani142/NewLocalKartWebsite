import HomePageClient from '@/components/HomePageClient';

export const metadata = {
  title: 'e-LocalKart - Same-hour Delivery from Local Stores',
  description: 'Get fresh groceries and daily essentials delivered to your doorstep in 40 minutes.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'e-LocalKart - Same-hour Delivery from Local Stores',
    description: 'Get fresh groceries and daily essentials delivered to your doorstep in 40 minutes.',
    url: 'https://www.e-localkart.in/',
    siteName: 'e-LocalKart',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e-LocalKart - Same-hour Delivery from Local Stores',
    description: 'Get fresh groceries and daily essentials delivered to your doorstep in 40 minutes.',
  },
};

export default function Home() {
  return <HomePageClient />;
}
