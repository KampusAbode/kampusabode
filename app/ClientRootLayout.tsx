"use client";

import { Toaster } from "react-hot-toast";
import Header from "./components/header/Header";
import WelcomeMessage from "./components/welcome/WelcomeMessage";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { ReduxProvider } from "./redux/provider";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <Toaster />
      <WelcomeMessage />
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </ReduxProvider>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user) || {
    isAuthenticated: false,
  };

  return (
    <div className={`wrapper ${user.isAuthenticated ? "grid" : "none"}`}>
      <Nav />
      <main>
        <Header />
        {children}

        <QuickService />
      </main>
      <Navigation />
    </div>
  );
}
