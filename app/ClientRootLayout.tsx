"use client";

import { Toaster } from "react-hot-toast";
import Header from "./components/header/Header";
import WelcomeMessage from "./components/welcome/WelcomeMessage";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useUserStore } from "./store/userStore";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster />
      <WelcomeMessage />
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </>
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const {user} = useUserStore((state) => state)

  return (
    <div className={`wrapper ${user ? "grid" : "none"}`}>
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
