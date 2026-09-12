import HomePageClient from '@/components/HomePageClient';

export const metadata = {
  title: 'e-LocalKart - Same-hour Delivery from Local Stores',
  description: 'Order fresh groceries and daily essentials on e-LocalKart (LocalKart / elocalkart) from trusted neighborhood stores with 40-minute doorstep delivery.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'e-LocalKart - Same-hour Delivery from Local Stores',
    description: 'Order fresh groceries and daily essentials on e-LocalKart (LocalKart / elocalkart) from trusted neighborhood stores with 40-minute doorstep delivery.',
    url: 'https://www.e-localkart.in/',
    siteName: 'e-LocalKart',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e-LocalKart - Same-hour Delivery from Local Stores',
    description: 'Order fresh groceries and daily essentials on e-LocalKart (LocalKart / elocalkart) from trusted neighborhood stores with 40-minute doorstep delivery.',
  },
};

export default function Home() {
  return <HomePageClient />;
}
