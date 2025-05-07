import type { Metadata } from "next";
import "./globals.css";
import ClientRootLayout from "./ClientRootLayout";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./lib/useAuthListener";
import Head from "next/head";

export const metadata: Metadata = {
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
    "oau",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
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
      </Head>
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
