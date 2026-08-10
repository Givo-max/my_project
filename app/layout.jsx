import "./globals.css";
import { createClient } from "@/lib/supabase/server";

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

async function getAdsEnabled() {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("app_settings")
      .select("ads_enabled")
      .eq("id", 1)
      .single();
    return data?.ads_enabled ?? true;
  } catch {
    return true;
  }
}

export default async function RootLayout({ children }) {
  const adsEnabled = await getAdsEnabled();

  return (
    <html lang="en">
      <body>
        {children}
        {adsEnabled && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(s){s.dataset.zone='11543791',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
            }}
          />
        )}
      </body>
    </html>
  );
}
