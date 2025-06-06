"use client";

import Header from "./components/header/Header";
import Navigation from "./components/navigation/Navigation";
import Nav from "./components/navMenu/nav";
import QuickService from "./components/quickservice/QuickService";
import { useUserStore } from "./store/userStore";
import { useRequireUser } from "./hooks/useRequireUser";
// import { logoutUser } from "./utils";
import Loader from "./components/loader/Loader";
import { useAuthListener } from "./hooks/useAuthListener";

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    
  );
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  const { initializing } = useAuthListener();

  if (initializing) {
    return <Loader />;
  }

  return (
    <div className={`wrapper `}>
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
