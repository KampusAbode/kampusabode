import type { Metadata } from "next";
import "./globals.css";
import ClientRootLayout from "./ClientRootLayout";
import { NotificationProvider } from "./context/NotificationContext";

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
      <body>
        <NotificationProvider>
          <ClientRootLayout>{children}</ClientRootLayout>
        </NotificationProvider>
      </body>
    </html>
  );
}
