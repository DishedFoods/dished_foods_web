import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleProvider } from "@/components/providers/GoogleProvider";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider, themeInitScript } from "@/context/ThemeContext";
import { RouteTransitionProvider } from "@/components/providers/RouteTransitionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dished — Canada's Home Kitchen Marketplace",
  description:
    "Discover passionate home chefs in your Canadian neighbourhood. Order authentic, homemade food delivered to your door.",
  keywords: ["home chef", "homemade food", "Canada", "food delivery", "authentic cuisine"],
  icons: {
    icon: "/dishedIconSVG.svg",
    shortcut: "/dishedIconSVG.svg",
    apple: "/dishedIconSVG.svg",
  },
  openGraph: {
    title: "Dished — Canada's Home Kitchen",
    description: "Homemade food, delivered to your door.",
    type: "website",
  },
  // Opt out of Google's FLoC / Topics API
  other: {
    "permission-policy": "interest-cohort=()",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/dishedIconSVG.svg" />
        {/* Responsive viewport — required for mobile-first layout */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Disable automatic phone-number detection (prevents unintended links) */}
        <meta name="format-detection" content="telephone=no" />
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Anti-flicker: set data-theme from localStorage before hydration */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {/* Skip-to-content link for keyboard / screen-reader users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <GoogleProvider>
            <AuthProvider>
              <CartProvider>
                <RouteTransitionProvider>
                  <main id="main-content">{children}</main>
                </RouteTransitionProvider>
              </CartProvider>
            </AuthProvider>
          </GoogleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
