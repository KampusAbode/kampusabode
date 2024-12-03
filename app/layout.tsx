import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/header/Header";
import WelcomeMessage from "./components/welcome/WelcomeMessage";
import Navigator from "./components/navigation/Navigation";
import { ReduxProvider } from "./redux/provider";
import Footer from "./components/footer/Footer";
import UseIsUser from "./components/useIsUser";

// Default metadata
export const metadata: Metadata = {
  title: "Kampabode App - Property Listing Site",
  description:
    "Find your ideal property with Kampabode. Explore a wide range of listings and discover your next apartment.",
  keywords:
    "property listings, real estate, apartments, houses, rentals, buy property, sell property",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Analytics />

        <ReduxProvider>
          <UseIsUser>
            <Header />
            <WelcomeMessage />
            <main>{children}</main>
            <Navigator />
            <Footer />
          </UseIsUser>
        </ReduxProvider>
      </body>
    </html>
  );
}
