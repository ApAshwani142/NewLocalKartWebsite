import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { ThemeProvider } from "@/hooks/useTheme";
import { LocationProvider } from "@/hooks/useLocation";
import ChatbotWidget from "@/components/ChatbotWidget";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://www.e-localkart.in'),
  title: {
    default: "e-LocalKart - Same-hour Delivery from Local Stores",
    template: "%s | e-LocalKart",
  },
  description: "Order fresh groceries and daily essentials on e-LocalKart (LocalKart / elocalkart) from trusted neighborhood stores with 40-minute doorstep delivery.",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/assets/Logo.png',
    shortcut: '/assets/Logo.png',
    apple: '/assets/Logo.png',
  },
  openGraph: {
    title: "e-LocalKart - Same-hour Delivery from Local Stores",
    description: "Order fresh groceries and daily essentials on e-LocalKart (LocalKart / elocalkart) from trusted neighborhood stores with 40-minute doorstep delivery.",
    url: 'https://www.e-localkart.in/',
    siteName: 'e-LocalKart',
    images: [
        url: '/assets/Logo.png',
        width: 1456,
        height: 1080,
        alt: 'e-LocalKart Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "e-LocalKart - Same-hour Delivery from Local Stores",
    description: "Order fresh groceries and daily essentials on e-LocalKart (LocalKart / elocalkart) from trusted neighborhood stores with 40-minute doorstep delivery.",
    images: ['/assets/Logo.png'],
  },
};

const organizationAndWebsiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.e-localkart.in/#organization",
      "name": "e-LocalKart",
      "alternateName": [
        "elocalkart",
        "LocalKart",
        "e local kart",
        "e-local kart"
      ],
      "url": "https://www.e-localkart.in",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.e-localkart.in/#logo",
        "url": "https://www.e-localkart.in/assets/Logo.png",
        "caption": "e-LocalKart"
      },
      "description": "e-LocalKart (LocalKart / elocalkart) connects consumers with verified neighborhood Kirana stores for express 15-45 minute doorstep delivery."
    },
    {
      "@type": "WebSite",
      "@id": "https://www.e-localkart.in/#website",
      "url": "https://www.e-localkart.in",
      "name": "e-LocalKart",
      "alternateName": [
        "elocalkart",
        "LocalKart",
        "e local kart",
        "e-local kart"
      ],
      "publisher": {
        "@id": "https://www.e-localkart.in/#organization"
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationAndWebsiteSchema) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col pb-16 md:pb-0">
        <ThemeProvider>
          <LocationProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <ChatbotWidget />
              </CartProvider>
            </AuthProvider>
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
