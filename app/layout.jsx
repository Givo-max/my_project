import "./globals.css";

export const metadata = {
  title: "Givo Food Analyzer",
  description: "Point, scan, and know exactly what's on your plate — instant AI nutrition analysis from a photo.",
  manifest: "/manifest.json",
  themeColor: "#1F9D6C",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1F9D6C",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

