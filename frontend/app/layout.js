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
  title: "e-LocalKart - Same-hour Delivery from Local Stores",
  description: "Get fresh groceries and daily essentials delivered to your doorstep in 40 minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
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
