import type { Metadata } from "next";
import "./globals.css";
import ClientRootLayout from "./ClientRootLayout";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./lib/useAuthListener";


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
          url: "/LOGO/logored_white", // ✅ Replace with your image URL
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
      images: ["/LOGO/logored_white"], // ✅ Same or different image URL
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
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4PMR34V8VF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4PMR34V8VF');
            `,
          }}
        />
      </head>
      <body>
        <ProtectedRoute>
          <NotificationProvider>
            <ClientRootLayout>{children}</ClientRootLayout>
          </NotificationProvider>
        </ProtectedRoute>
      </body>
    </html>
  );
}
