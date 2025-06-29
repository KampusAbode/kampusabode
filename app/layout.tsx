import type { Metadata } from "next";
import "./globals.css";
import Script from 'next/script';
import ClientRootLayout from "./ClientRootLayout";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "react-hot-toast";
import WelcomeMessage from "./components/welcome/WelcomeMessage";
import { Analytics } from '@vercel/analytics/next';
import { GA_MEASUREMENT_ID } from "./lib/ga";

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: "Kampusabode",
    description:
      "Find your ideal apartment with Kampusabode. Explore a wide range of listings and discover your next apartment.",
    keywords: [
      "apartment listings",
      "real estate",
      "apartments",
      "houses",
      "rentals",
      "students",
      "university",
    ],
    openGraph: {
      title: "Kampusabode App - apartment Listing Site",
      description:
        "Find your ideal apartment with Kampusabode. Explore a wide range of listings and discover your next apartment.",
      url: "https://kampusabode.com",
      siteName: "Kampusabode",
      images: [
        {
          url: "https://kampusabode.com/LOGO/logored_white.jpg",
          width: 1200,
          height: 630,
          alt: "Kampusabode - Apartment Listing Site",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Kampusabode App - apartment Listing Site",
      description:
        "Find your ideal apartment with Kampusabode. Explore a wide range of listings and discover your next apartment.",
      images: ["https://kampusabode.com/LOGO/logored_white.jpg"],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  return (
    <html lang="en">
      <head>
        {/* GA Script */}
        
<Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}"></Script>
<Script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_MEASUREMENT_ID}');
</Script>
      </head>
      <body>
        <Toaster
          containerStyle={{
            zIndex: 9999999,
          }}
        />
        <WelcomeMessage />

        <NotificationProvider>
          <ClientRootLayout>{children}</ClientRootLayout>
        </NotificationProvider>

        <Analytics />
      </body>
    </html>
  );
}
