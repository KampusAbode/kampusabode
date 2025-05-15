import type { Metadata } from "next";
import "./globals.css";
import ClientRootLayout from "./ClientRootLayout";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "react-hot-toast";
import WelcomeMessage from "./components/welcome/WelcomeMessage";


export async function generateMetadata(): Promise<Metadata> {

  return {
    title: "Kampusabode App - apartment Listing Site",
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
          url: "../public/LOGO/logored_white.jpg",
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
      images: ["../public/LOGO/logored_white.jpg"],
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
        <script defer src="/_vercel/insights/script.js"></script>
      </head>
      <body>
        <Toaster
          containerStyle={{
            zIndex: 999999,
          }}
        />
        <WelcomeMessage />

        <NotificationProvider>
          <ClientRootLayout>{children}</ClientRootLayout>
        </NotificationProvider>
      </body>
    </html>
  );
}
