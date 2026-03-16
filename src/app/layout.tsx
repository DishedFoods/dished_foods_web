import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dished — Canada's Home Kitchen Marketplace",
  description:
    "Discover passionate home chefs in your Canadian neighbourhood. Order authentic, homemade food delivered to your door.",
  keywords: ["home chef", "homemade food", "Canada", "food delivery", "authentic cuisine"],
  icons: {
    icon: '/dished-icon.png',
    apple: '/dished-icon.png',
  },
  openGraph: {
    title: "Dished — Canada's Home Kitchen",
    description: "Homemade food, delivered to your door.",
    type: "website",
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
        <link rel="icon" href="/dished-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
